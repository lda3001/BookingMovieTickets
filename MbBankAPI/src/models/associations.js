const User = require('./User');
const Booking = require('./Booking');
const Transaction = require('./Transaction');

// Define all associations here to avoid circular dependencies

// User - Booking relationship
User.hasMany(Booking, { 
  foreignKey: 'user_id',
  as: 'bookings'
});

Booking.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

// Booking - Transaction relationship
Booking.hasMany(Transaction, { 
  foreignKey: 'booking_code',
  sourceKey: 'bookingCode',
  as: 'transactions'
});

Transaction.belongsTo(Booking, { 
  foreignKey: 'booking_code',
  targetKey: 'bookingCode',
  as: 'booking'
});

module.exports = {
  User,
  Booking,
  Transaction
}; 