import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import UserModel from "./UserModel.js";

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
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    totalSum: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    orderStatus: {
      type: DataTypes.STRING,
      defaultValue: "Pending"
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
