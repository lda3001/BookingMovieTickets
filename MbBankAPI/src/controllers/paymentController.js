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
   extractBookingCode(description) {
  // for BANK ACB

  const lines = description.split(/\s+/); // Tách theo từng từ

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

  async initiatePayment(req, res) {
    try {
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

      let sessionId;
      // Kiểm tra và sử dụng session hiện tại nếu còn hợp lệ
      if (this.isSessionValid()) {
        sessionId = this.sessionData.sessionId;
        console.log('Sử dụng session hiện tại:', sessionId);
      } else {
        // Login to MB Bank nếu session không hợp lệ
        const loginResult = await mbBankService.login(mbUsername, mbPassword);
        if (!loginResult.sessionId) {
          return res.status(500).json({
            success: false,
            message: 'Không thể kết nối với ngân hàng!',
            data: JSON.stringify(loginResult)
          });
        }
        sessionId = loginResult.sessionId;
        this.saveSession(sessionId);
        console.log('Tạo session mới:', sessionId);
      }

      // Get transaction history
      const deviceIdCommon = `ms7jhh48-mbib-0000-0000-2024071018571948`;
      const transactions = await mbBankService.getTransactionHistory(
        sessionId,
        mbAccountNo,
        deviceIdCommon,
        mbUsername
      );
      if (!transactions || !transactions.transactionHistoryList) {
        return res.status(500).json({
          success: false,
          message: 'Không thể lấy danh sách giao dịch!'
        });
      }

      // Process new transactions
      let totalProcessed = 0;
      if (Array.isArray(transactions.transactionHistoryList)) {
        for (const transaction of transactions.transactionHistoryList) {
          try {
            // Extract userId from description
            const BookingCode = this.extractBookingCode(transaction.description);

            if (!BookingCode) {
              console.log('Không tìm thấy userId trong nội dung chuyển khoản:', transaction.description);
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
            }
            res.json({
              success: true,
              message: 'Giao dịch đã được ghi nhận!',
              data: transaction
            });
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

      res.json({
        success: true,
        message: 'Xử lý giao dịch thành công!',
        data: {
          totalProcessed,
          //transactions: transactions
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      // Nếu lỗi liên quan đến session, xóa session hiện tại
      if (error.message && error.message.includes('session')) {
        this.sessionData.sessionId = null;
        this.sessionData.lastLoginTime = null;
      }
      res.status(500).json({
        success: false,
        message: 'error: ' + error
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