'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     Product.belongsToMany(models.Image,{
      through:"Product_Image",
      foreignKey:"product_id"
     })
     
    }
  }
  Product.init({
    product_name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,

  
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};