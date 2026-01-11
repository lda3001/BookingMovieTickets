const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');
const loadWasm = require('../loadWasm')

class MBBankService {
  constructor() {
    this.jar = new CookieJar();
    this.client = wrapper(axios.create({ jar: this.jar }));
    this.auth = "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm";
    this.urls = {
      transaction: 'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history'
    };
  }

  async downloadWasmFile() {
    const wasmPath = path.resolve(__dirname, './main.wasm');
    if (!fs.existsSync(wasmPath)) {
    
      const response = await this.client({
        url: "https://online.mbbank.com.vn/assets/wasm/main.wasm",
        method: "GET",
        responseType: "stream",
      });
      const writer = fs.createWriteStream(wasmPath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    }
  }

  async getCaptcha() {
    const response = await this.client.post(
      "https://online.mbbank.com.vn/api/retail-internetbankingms/getCaptchaImage",
      {
    refNo: "2024071018571949",
    deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948",
    sessionId: "",
  },
      {
        headers: {
          Authorization: this.auth,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        },
      }
    );
    return response.data.imageString;
  }

  async solveCaptcha(base64Image) {
    const url = "http://103.72.96.214:8277/api/captcha/mbbank";
    const response = await axios.post(url, { base64: base64Image }, {
      headers: { "Content-Type": "application/json" }
    });
    
    if (!response.data || response.data.status !== "success" || !response.data.captcha) {
      throw new Error("Failed to solve captcha");
    }
    
    return response.data.captcha;
  }

  async login(username, password) {
    try {
      await this.downloadWasmFile();
    
    const base64Image = await this.getCaptcha();
    const captchaSolution = await this.solveCaptcha(base64Image);

    const request = {
      userId: username,
      password: crypto.createHash("md5").update(password).digest("hex"),
      captcha: captchaSolution,
      ibAuthen2faString: "c722fa8dd6f5179150f472497e022ba0",
      sessionId: null,
       refNo: "0123456789-2024071018223800",
      deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948",
    };

    const dataEnc = await loadWasm.loadWasm(fs.readFileSync("./main.wasm"), request, "0");
    

    const response = await this.client.post(
      "https://online.mbbank.com.vn/api/retail_web/internetbanking/v2.0/doLogin",
      { dataEnc },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          app: "MB_WEB",
          authorization: this.auth,
          "content-type": "application/json; charset=UTF-8",
          refno: `${Date.now()}`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        },
      }
    );

      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
    
  }

  async getTransactionHistory(sessionId, accountNo, deviceIdCommon, username) {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 1);
      
      const data = {
        accountNo: accountNo,
        deviceIdCommon: deviceIdCommon,
        fromDate: fromDate.toLocaleDateString('en-GB'), // Format: DD/MM/YYYY
        refNo: `${username}-${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}00`,
        sessionId: sessionId,
        toDate: new Date().toLocaleDateString('en-GB'),
        type: 'ACCOUNT',
        historyType: 'DATE_RANGE',
        historyNumber: ''
      };

      const response = await this.client.post(
        this.urls.transaction,
        data,
        {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Authorization': 'Basic QURNSU46QURNSU4=',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json; charset=UTF-8',
            'Deviceid': deviceIdCommon,
            'Host': 'online.mbbank.com.vn',
            'Origin': 'https://online.mbbank.com.vn',
            'Referer': 'https://online.mbbank.com.vn/information-account/source-account',
            'Refno': `${username}-${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}00`,
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      );

      // Format dates in the response
      if (response.data) {
        if (response.data.postingDate) {
          const postingDate = new Date(response.data.postingDate);
          response.data.postingDate = postingDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        }
        if (response.data.transactionDate) {
          const transactionDate = new Date(response.data.transactionDate);
          response.data.transactionDate = transactionDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }
  
}

module.exports = new MBBankService(); 