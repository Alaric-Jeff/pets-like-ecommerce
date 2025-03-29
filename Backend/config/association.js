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

const AssociationConfig = () => {

    UserModel.hasMany(CartModel, { foreignKey: "userid", onDelete: "CASCADE" });
    CartModel.belongsTo(UserModel, { foreignKey: "userid" });

    ProductModel.hasOne(ProductImageModel, { foreignKey: "productId", onDelete: "CASCADE" });
    ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId" });

    ProductModel.hasMany(ProductReviewModel, { foreignKey: "productId", onDelete: "CASCADE" });
    ProductReviewModel.belongsTo(ProductModel, { foreignKey: "productId" });

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
