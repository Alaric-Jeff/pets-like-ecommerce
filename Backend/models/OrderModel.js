import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import ProductModel from "./ProductModel.js";
import UserModel from "./UserModel.js";
import CartModel from '../models/CartModel.js'

class Order extends Model {}

const OrderModel = Order.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userid: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: UserModel,
        key: "userid"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE" 
    },
    productId:{
      type: DataTypes.INTEGER,
      references:{
        model: ProductModel,
        key: "productId"
      }
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cartId:{
      type: DataTypes.INTEGER,
      references: {
        model: CartModel,
        key: "cartId"
      }
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    orderStatus: {
      type: DataTypes.STRING,
      defaultValue: "To Review"
    }
  },
  {
    sequelize: db,
    modelName: "Order",
    tableName: "orders",
    timestamps: true
  }
);

export default OrderModel;
