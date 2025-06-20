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

      // Define the association to the "User" model
      Inventory.belongsTo(models.User, {
        foreignKey: 'userId', // Define the foreign key in the "Inventory" table
        onDelete: 'CASCADE', // Optional: Define the onDelete behavior
      });
    }
  }

  Inventory.init({
    action: DataTypes.STRING, // refill or sell
    quantity: DataTypes.INTEGER,
    date: DataTypes.DATE,
    cost: DataTypes.DECIMAL(10, 2), // Specify precision and scale to avoid rounding issues
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items', // Name of the target table
        key: 'id', // Key in the target table
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Name of the target table
        key: 'id', // Key in the target table
      },
    },
  }, {
    sequelize,
    modelName: 'Inventory',
  });

  return Inventory;
};
