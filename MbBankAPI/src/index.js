const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const sequelize = require('./models/index');
const loadWasm = require('./loadWasm')
const fs = require('fs');
const mbBankService = require('./services/mbBankService');
const paymentController = require('./controllers/paymentController');


const { Op } = require('sequelize');
const Transaction = require('./models/Transaction');


// Import associations
require('./models/associations');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', true);



// Cấu hình phục vụ file tĩnh
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút!'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiting cho login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 lần đăng nhập sai mỗi IP trong 15 phút
  
  handler: (req, res) => {
    console.log(`[LOGIN RATE LIMIT] IP bị chặn: ${req.ip} | Đường dẫn: ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      message: 'Quá nhiều lần đăng nhập sai, vui lòng thử lại sau 15 phút!'
    });
  }
});

// Áp dụng rate limiting cho tất cả các routes
app.use((req, res, next) => {
  if (['/api/login', '/api/register'].includes(req.path)) return next();
  return limiter(req, res, next);
});

// Rate limiting riêng cho route đăng ký
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng ký mỗi IP trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều lần đăng ký từ IP này, vui lòng thử lại sau 1 giờ!'
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sync database
sequelize.sync({ alter: true, force: false })
  .then(async () => {
    // Sync Character model first
   
    await Transaction.sync();
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});




// Payment routes
app.get('/api/payment/initiate', async (req, res) => {
  try {
    await paymentController.initiatePayment(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
});
app.get('/api/hello', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Hello World!'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
});

app.post('/api/bder', async (req, res) => {
  try {
    const {data} = req.body;
    const dataEnc = await mbBankService.bder(data);
    res.json({
      success: true,
      message: 'Bder thành công!',
      data: dataEnc
    });
  } catch (error) {
    console.error('Error bder:', error);
    res.status(401).json({
      success: false,
      message: 'Lỗi khi đăng nhập!', error: error.message
    });
  }
});

app.get('/api/payment/verify/:transactionId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token!'
    });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    await paymentController.verifyPayment(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 