import {Sequelize, DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";

class Order extends Model {}

const OrderModel = Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    productName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderQuantity:{
       type: DataTypes.INTEGER,
       allowNull: false
    },
    productPrice:{
        type: DataTypes.DOUBLE,
    },
    totalOrderPrice:{
        type: DataTypes.DOUBLE
    },
    productDietaryCategory: {
        type: DataTypes.STRING
    },
    productBreedCategory:{
        type: DataTypes.STRING
    },
    productLifeStage:{
        type: DataTypes.STRING
    }
},{
    sequelize: db,
    tableName: "order_table",
    timestamps: false
});

export default OrderModel;