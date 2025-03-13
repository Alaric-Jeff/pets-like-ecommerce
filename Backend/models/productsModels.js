import { Sequelize, DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";

class products extends Model {}

const productModel = products.init({
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productFoodType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productRecommendedAgeType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productForBreed:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    productStock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    sequelize: db,
    tablename: "products_table",
    timestamps: false
})

export default productModel;