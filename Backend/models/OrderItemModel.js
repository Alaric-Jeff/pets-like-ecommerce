import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js"; 

class OrderItem extends Model {}

OrderItem.init({
    orderItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize: db,  
    modelName: "OrderItem", 
    timestamps: true
});

export default OrderItem;
