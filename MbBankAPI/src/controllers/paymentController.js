const mbBankService = require('../services/mbBankService');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const Booking = require('../models/Booking');

class PaymentController {
  constructor() {
    this.sessionData = {
      sessionId: null,
      lastLoginTime: null,
      expiresIn: 5 * 60 * 1000 // 5 phút
    };
  }

  // Hàm trích xuất bookingCode từ nội dung chuyển khoản
  async syncPendingPayments(source = 'worker') {
    return new Promise((resolve) => {
      const result = {
        statusCode: 200,
        payload: null
      };

      const res = {
        status(code) {
          result.statusCode = code;
          return this;
        },
        json(payload) {
          result.payload = payload;
          resolve(result);
          return payload;
        }
      };

      this.initiatePayment({ query: { source } }, res).catch((error) => {
        resolve({
          statusCode: 500,
          payload: {
            success: false,
            message: 'Payment sync failed: ' + error.message
          }
        });
      });
    });
  }

  extractBookingCode(description) {
    if (!description) return null;

    const lines = description.split(/\s+/);
    for (let i = 0; i < lines.length; i++) {
      if (/^GC$/i.test(lines[i])) {
        const next = lines[i + 1];
        if (/^\d+$/.test(next)) {
          return `GC${next}`;
        }
      }
    }

    const merged = description.replace(/\s+/g, '');
    const match = merged.match(/GC(\d{4,})/i);
    if (match) {
      return `GC${match[1]}`;
    }

    return null;
  }

  summarizeBankResponse(response) {
    if (!response || typeof response !== 'object') {
      return response;
    }

    return {
      keys: Object.keys(response),
      responseCode: response.responseCode || response.code || response.errorCode || response.result?.responseCode,
      message: response.message || response.errorDesc || response.result?.message || response.result?.responseMessage,
      transactionHistoryListType: response.transactionHistoryList === null
        ? 'null'
        : Array.isArray(response.transactionHistoryList)
          ? 'array'
          : typeof response.transactionHistoryList
    };
  }


  // Kiểm tra session còn hợp lệ không
  isSessionValid() {
    if (!this.sessionData.sessionId || !this.sessionData.lastLoginTime) {
      return false;
    }
    const now = Date.now();
    return (now - this.sessionData.lastLoginTime) < this.sessionData.expiresIn;
  }

  // Lưu session mới
  saveSession(sessionId) {
    this.sessionData.sessionId = sessionId;
    this.sessionData.lastLoginTime = Date.now();
  }

  resetSession() {
    this.sessionData.sessionId = null;
    this.sessionData.lastLoginTime = null;
  }

  isSessionInvalidResponse(response) {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const text = [
      response.message,
      response.errorDesc,
      response.result?.message,
      response.result?.responseMessage,
      response.transactionHistoryList?.message,
      response.transactionHistoryList?.responseMessage
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return text.includes('session invalid') || (text.includes('session') && text.includes('invalid'));
  }

  async loginToMbBank(username, password, source) {
    const loginResult = await mbBankService.login(username, password);
    if (!loginResult?.sessionId) {
      console.log(`[PAYMENT SYNC] ${source} MB login failed`, this.summarizeBankResponse(loginResult));
      return {
        ok: false,
        bankResponse: loginResult
      };
    }

    this.saveSession(loginResult.sessionId);
    console.log(`[PAYMENT SYNC] ${source} created MB session`);
    return {
      ok: true,
      sessionId: loginResult.sessionId
    };
  }

  async getTransactionHistoryWithRetry({ username, password, accountNo, deviceIdCommon, source }) {
    const attempts = [];

    for (let attempt = 1; attempt <= 2; attempt++) {
      let bankSessionId;
      if (attempt === 1 && this.isSessionValid()) {
        bankSessionId = this.sessionData.sessionId;
        console.log(`[PAYMENT SYNC] ${source} using cached MB session`);
      } else {
        const login = await this.loginToMbBank(username, password, source);
        if (!login.ok) {
          return {
            ok: false,
            bankResponse: login.bankResponse,
            attempts
          };
        }
        bankSessionId = login.sessionId;
      }

      const response = await mbBankService.getTransactionHistory(
        bankSessionId,
        accountNo,
        deviceIdCommon,
        username
      );
      attempts.push(this.summarizeBankResponse(response));

      if (this.isSessionInvalidResponse(response)) {
        console.log(
          `[PAYMENT SYNC] ${source} MB session invalid on attempt ${attempt}, refreshing session`,
          this.summarizeBankResponse(response)
        );
        this.resetSession();
        if (attempt < 2) {
          continue;
        }
      }

      return {
        ok: true,
        transactions: response,
        attempts
      };
    }

    return {
      ok: false,
      attempts
    };
  }

  async initiatePayment(req, res) {
    const source = req?.query?.source || 'manual';
    const startedAt = Date.now();
    try {
      console.log(`[PAYMENT SYNC] ${source} scan started`);
      // Get MB Bank credentials from environment variables
      const mbUsername = process.env.MB_USERNAME;
      const mbPassword = process.env.MB_PASSWORD;
      const mbAccountNo = process.env.MB_ACCOUNT_NO;

      if (!mbUsername || !mbPassword || !mbAccountNo) {
        return res.status(500).json({
          success: false,
          message: 'Cấu hình ngân hàng không hợp lệ!'
        });
      }

      const deviceIdCommon = `ms7jhh48-mbib-0000-0000-2024071018571948`;
      const historyResult = await this.getTransactionHistoryWithRetry({
        username: mbUsername,
        password: mbPassword,
        accountNo: mbAccountNo,
        deviceIdCommon,
        source
      });

      if (!historyResult.ok) {
        return res.status(500).json({
          success: false,
          message: 'Unable to connect to MB Bank',
          data: {
            bankResponse: this.summarizeBankResponse(historyResult.bankResponse),
            attempts: historyResult.attempts || []
          }
        });
      }

      const transactions = historyResult.transactions;
      if (!transactions || !Array.isArray(transactions.transactionHistoryList)) {
        console.log(
          `[PAYMENT SYNC] ${source} scan failed: missing transaction history`,
          this.summarizeBankResponse(transactions)
        );
        return res.status(500).json({
          success: false,
          message: 'Unable to get bank transaction history',
          data: {
            bankResponse: this.summarizeBankResponse(transactions),
            attempts: historyResult.attempts || []
          }
        });
      }

      // Process new transactions
      let totalProcessed = 0;
      let newTransactionsCount = 0;
      const checkedTransactions = Array.isArray(transactions.transactionHistoryList)
        ? transactions.transactionHistoryList.length
        : 0;
      if (Array.isArray(transactions.transactionHistoryList)) {
        for (const transaction of transactions.transactionHistoryList) {
          try {
            // Extract booking code from transfer description.
            const BookingCode = this.extractBookingCode(transaction.description);

            if (!BookingCode) {
              console.log('Không tìm thấy bookingCode trong nội dung chuyển khoản:', transaction.description);
              continue;
            }

            const booking = await Booking.findOne({
              where: { bookingCode: BookingCode }
            });
            if (!booking) {
              console.log('Không tìm thấy booking với BookingCode:', BookingCode);
              continue;
            }


            // Check if transaction already exists
            const existingTransaction = await Transaction.findOne({
              where: { refNo: transaction.refNo }
            });

            if (!existingTransaction) {
              // Create new transaction
              // Convert DD/MM/YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss
              const [datePart, timePart] = transaction.postingDate.split(' ');
              const [day, month, year] = datePart.split('/');
              const postingDate = new Date(`${year}-${month}-${day} ${timePart}`);

              const [datePart2, timePart2] = transaction.transactionDate.split(' ');
              const [day2, month2, year2] = datePart2.split('/');
              const transactionDate = new Date(`${year2}-${month2}-${day2} ${timePart2}`);

              await Transaction.create({
                refNo: transaction.refNo,
                accountNo: transaction.accountNo,
                postingDate: postingDate,
                transactionDate: transactionDate.toISOString(),
                amount: transaction.creditAmount,
                description: transaction.description,
                type: transaction.transactionType,
                status: "SUCCESS",
                booking_code: booking.bookingCode,
                isProcessed: false
              });
              newTransactionsCount++;
            }
          } catch (error) {
            console.error('Error processing transaction:', error);
            continue;
          }
        }

        // Process unprocessed transactions
        const unprocessedTransactions = await Transaction.findAll({
          where: {
            isProcessed: false,
            status: 'SUCCESS'
          }
        });

        for (const transaction of unprocessedTransactions) {
          try {
            // Get booking
            const booking = await Booking.findOne({
              where: { bookingCode: transaction.booking_code }
            });
            if (!booking) {
              console.log('Không tìm thấy booking với BookingCode:', transaction.booking_code);
              continue;
            }

            await booking.update({
              status: 'CONFIRMED',
              paymentStatus: 'PAID'
            });


            await transaction.update({
              isProcessed: true,
              processedAt: new Date()
            });

            totalProcessed++;
          } catch (error) {
            console.error('Error updating transaction status:', error);
            continue;
          }
        }
      }

      console.log(
        `[PAYMENT SYNC] ${source} scan finished: checked=${checkedTransactions}, new=${newTransactionsCount}, processed=${totalProcessed}, durationMs=${Date.now() - startedAt}`
      );

      res.json({
        success: true,
        message: 'Xử lý giao dịch thành công!',
        data: {
          checkedTransactions,
          newTransactionsCount,
          totalProcessed,
          //transactions: transactions
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      // Nếu lỗi liên quan đến session, xóa session hiện tại
      if (error.message && error.message.toLowerCase().includes('session')) {
        this.sessionData.sessionId = null;
        this.sessionData.lastLoginTime = null;
      }
      res.status(500).json({
        success: false,
        message: error.message || String(error)
      });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { transactionId } = req.params;

      // Get transaction from database
      const transaction = await Transaction.findOne({
        where: { refNo: transactionId }
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy giao dịch!'
        });
      }

      res.json({
        success: true,
        message: 'Xác minh giao dịch thành công!',
        data: transaction
      });

    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
      });
    }
  }

  async getTransactionHistory(req, res) {
    try {
      const { userId } = req.params;
      const transactions = await Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        message: 'Lấy lịch sử giao dịch thành công!',
        data: transactions
      });

    } catch (error) {
      console.error('Transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
      });
    }
  }
}

module.exports = new PaymentController(); 
