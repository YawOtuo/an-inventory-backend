'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Shop extends Model {
        static associate(models) {
            // Define the association to the "Inventory" model
            Shop.hasMany(models.Inventory, {
                foreignKey: 'shopId', // Define the foreign key in the "Inventory" table
                onDelete: 'SET NULL', // Optional: Define the onDelete behavior
            });

            // Define the association to the "Item" model
            Shop.hasMany(models.Item, {
                foreignKey: 'shopId', // Define the foreign key in the "Item" table
                onDelete: 'SET NULL', // Optional: Define the onDelete behavior
            });

            // Define the association to the "User" model
            // Shop.hasMany(models.User, {
            //     foreignKey: 'shopId', // Define the foreign key in the "User" table
            //     onDelete: 'CASCADE', // Optional: Define the onDelete behavior
            // });
        }
    }

    Shop.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Shop',
    });

    return Shop;
};
