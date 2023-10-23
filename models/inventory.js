'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Define the association to the "Item" model
      Inventory.belongsTo(models.Item, {
        foreignKey: 'itemId', // Define the foreign key in the "Inventory" table
        onDelete: 'CASCADE', // Optional: Define the onDelete behavior
      });
    }
  }

  Inventory.init({
    action: DataTypes.STRING, // refill or sell
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Inventory',
  });

  return Inventory;
};
