import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import ProductModel from "./ProductModel.js"; 

class ProductReview extends Model {}

const ProductReviewModel = ProductReview.init({
    ratingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductModel, 
            key: "productId",
        },
        onDelete: "CASCADE"
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    reviewText: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: "product_review_table",
    timestamps: true
});

export default ProductReviewModel;
