import UserModel from "../models/UserModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";
import CartModel from "../models/CartModel.js";
import ProductImageModel from "../models/ProductImageModel.js";
import OrderItemModel from "../models/OrderItemModel.js";
import ProfileImageModel from "../models/ProfileImageModel.js";
import logger from "../utils/logger.js";
import ReviewLikeModel from "../models/ReviewLikeModel.js";

const AssociationConfig = () => {

  // User and Profile associations
  UserModel.hasOne(UserProfileModel, { foreignKey: "userid", onDelete: "CASCADE" });
  UserProfileModel.belongsTo(UserModel, { foreignKey: "userid" });

  // Cart associations (User and Product)
  UserModel.hasMany(CartModel, { foreignKey: "userid", onDelete: "CASCADE" });
  CartModel.belongsTo(UserModel, { foreignKey: "userid" });
  
  ProductModel.hasMany(CartModel, { foreignKey: "productId", onDelete: "CASCADE" });
  CartModel.belongsTo(ProductModel, { foreignKey: "productId" });

  ProductModel.hasMany(OrderModel, { foreignKey: "productId", onDelete: "CASCADE" });
  OrderModel.belongsTo(ProductModel, { foreignKey: "productId" });

  // Product and Image associations
  ProductModel.hasOne(ProductImageModel, { foreignKey: "productId", onDelete: "CASCADE" });
  ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId" });

  // Product and Review associations
  ProductModel.hasMany(ProductReviewModel, { foreignKey: "productId", onDelete: "CASCADE" });
  ProductReviewModel.belongsTo(ProductModel, { foreignKey: "productId", onDelete: "CASCADE" });

  // User and Review associations
  UserModel.hasMany(ProductReviewModel, { foreignKey: "userid", onDelete: "CASCADE" });
  ProductReviewModel.belongsTo(UserModel, { foreignKey: "userid", onDelete: "CASCADE" });

  // Review and ReviewLike associations
  ProductReviewModel.hasMany(ReviewLikeModel, { foreignKey: "reviewId", as: "ReviewLikes", onDelete: "CASCADE" });
  ReviewLikeModel.belongsTo(ProductReviewModel, { foreignKey: "reviewId", as: "ReviewLikes", onDelete: "CASCADE" });

  // User and ReviewLike associations
  UserModel.hasMany(ReviewLikeModel, { foreignKey: "userid", onDelete: "CASCADE" });
  ReviewLikeModel.belongsTo(UserModel, { foreignKey: "userid", onDelete: "CASCADE" });

  UserModel.hasOne(ProfileImageModel, { foreignKey: "userid", onDelete: "CASCADE", as: "ProfileImage" });
  ProfileImageModel.belongsTo(UserModel, { foreignKey: "userid", as: "ProfileImage" });


  OrderModel.belongsToMany(ProductModel, {
    through: OrderItemModel,
    foreignKey: "orderId",
    onDelete: "CASCADE"
  });
  ProductModel.belongsToMany(OrderModel, {
    through: OrderItemModel,
    foreignKey: "productId",
    onDelete: "CASCADE"
  });

  logger.info("All models associated successfully.");
};

export default AssociationConfig;
