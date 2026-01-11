const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  
  refNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  accountNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  postingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  amount: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  booking_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'booking_code'
    }
  },
  
  isProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
  
}, {
  timestamps: true,
  tableName: 'transactions',
  indexes: [
    {
      unique: true,
      fields: ['refNo']
    },
    {
      fields: ['booking_code']
    }
  ]
});

module.exports = Transaction; 