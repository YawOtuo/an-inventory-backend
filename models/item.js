'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    type: DataTypes.STRING,
    quantity: DataTypes.STRING,
    description: DataTypes.STRING,
    variants: {
      type: DataTypes.JSON, // Define the "variants" attribute as JSON
      allowNull: true, // Set to true if variants can be null, otherwise false
    },


  },
   {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};