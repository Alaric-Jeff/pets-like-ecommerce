import UserModel from "../models/UserModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";

const AssociationConfig = async () => {
    UserModel.hasOne(UserProfileModel);
    UserProfileModel.belongsTo(UserModel);

    UserModel.hasMany(OrderModel);
    OrderModel.belongsTo(UserModel);

    ProductModel.hasMany(ProductReviewModel, { foreignKey: "productId", onDelete: "CASCADE" });
    ProductReviewModel.belongsTo(ProductModel, { foreignKey: "productId" });
};

export default AssociationConfig;
