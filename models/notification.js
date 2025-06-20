'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Define association with the Shop model
      Notification.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop', // Alias for the association
        onDelete: 'CASCADE', // If a shop is deleted, delete all associated notifications
      });
    }
  }

  Notification.init({
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    type: DataTypes.STRING,
    read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
  });

  return Notification;
};
