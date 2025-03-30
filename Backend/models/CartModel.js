import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import UserModel from "./UserModel.js";
import ProductModel from "./ProductModel.js";

class Cart extends Model {}

const CartModel = Cart.init({
    cartId: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        unique: true,
        autoIncrement: true
    }, 
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel, 
            key: "userid"
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductModel, 
            key: "productId"
        }
    },
    productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: db,
    modelName: "CartModel",
    tableName: "cart_table",
    timestamps: true,
    hooks: {
        beforeSave: (cart, options) => {
            if(cart.productPrice && cart.quantity) {
                cart.totalPrice = cart.productPrice * cart.quantity;
            }
        }
    }
});

export default CartModel;
