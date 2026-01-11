const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  fullName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'full_name'
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth'
  },

  role: {
    type: DataTypes.ENUM('USER', 'ADMIN'),
    allowNull: true,
    defaultValue: 'USER'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'is_active'
  }

}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['email']
    }
  ]
});

module.exports = User;
