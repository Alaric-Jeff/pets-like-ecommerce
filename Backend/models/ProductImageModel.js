import { DataTypes, Model } from 'sequelize';
import ProductModel from '../models/ProductModel.js';
import { db } from '../config/database.js';

class ProductImage extends Model {}

const ProductImageModel = ProductImage.init(
  {
    imageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductModel,
        key: 'productId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' 
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db,
    modelName: 'ProductImage',
    tableName: 'product_images',
    timestamps: true 
  }
);

export default ProductImageModel;
