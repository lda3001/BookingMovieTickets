const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  bookingCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    field: 'booking_code'
  },

  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  showtime_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'showtimes',
      key: 'id'
    }
  },

  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'total_price'
  },

  status: {
    type: DataTypes.ENUM(
      'PENDING',
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED'
    ),
    allowNull: true
  },

  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_method'
  },

  paymentStatus: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'payment_status'
  }

}, {
  timestamps: true,
  tableName: 'bookings',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['booking_code']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['showtime_id']
    }
  ]
});

module.exports = Booking;
