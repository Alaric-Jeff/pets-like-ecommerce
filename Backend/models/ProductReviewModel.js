import { DataTypes, Model } from "sequelize";
import { db } from "../config/database.js";
import ProductModel from "./ProductModel.js"; 
import UserModel from "./UserModel.js";

class ProductReview extends Model {}

const ProductReviewModel = ProductReview.init({
    reviewId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductModel, 
            key: "productId"
        },
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel, 
            key: "userid"
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    reviewText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: db,
    tableName: "product_review_table",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["productId", "userid"]
        }
    ]
});

export default ProductReviewModel;
