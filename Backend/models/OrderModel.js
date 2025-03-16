import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import UserModel from "./UserModel.js";

class Order extends Model {}

const OrderModel = Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: "userid"
        }
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
    }
},{
    sequelize: db,
    tableName: "order_table",
    timestamps: false
});

export default OrderModel;