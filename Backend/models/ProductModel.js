import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";

class Product extends Model {}

const ProductModel = Product.init({
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Description Unavailable"
    },
    productPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    productStock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    productMeatType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productAgeType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productBreedType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productisHealthTreat:{
        type: DataTypes.BOOLEAN
    }

}, {
    sequelize: db,
    tableName: "product_table",
    timestamps: false
})

export default ProductModel;


