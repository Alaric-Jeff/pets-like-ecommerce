  import { DataTypes, Model } from "sequelize";
  import { db } from "../config/database.js";
  import ProductReviewModel from "./ProductReviewModel.js";
  import UserModel from "./UserModel.js";

  class ReviewLike extends Model {}

  const ReviewLikeModel = ReviewLike.init({
    reactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductReviewModel,
        key: "reviewid",
      },
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "userid",
      },
    }
  }, {
    sequelize: db,
    tableName: "review_like_table",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["reviewId", "userid"]
      }
    ]
  });

  export default ReviewLikeModel;
