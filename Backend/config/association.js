import UserModel from "../models/UserModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";
import CartModel from "../models/CartModel.js";
import OrderItemModel from "../models/OrderItemModel.js"; // Pivot table for Many-to-Many

const AssociationConfig = () => {
    UserModel.hasOne(UserProfileModel, { foreignKey: "userid", onDelete: "CASCADE" });
    UserProfileModel.belongsTo(UserModel, { foreignKey: "userid" });

    UserModel.hasMany(CartModel, { foreignKey: "userid", onDelete: "CASCADE" });
    CartModel.belongsTo(UserModel, { foreignKey: "userid" });

    CartModel.hasOne(OrderModel, { foreignKey: "cartId", onDelete: "CASCADE" });
    OrderModel.belongsTo(CartModel, { foreignKey: "cartId" });

    ProductModel.hasMany(ProductReviewModel, { foreignKey: "productId", onDelete: "CASCADE" });
    ProductReviewModel.belongsTo(ProductModel, { foreignKey: "productId" });

    OrderModel.belongsToMany(ProductModel, { through: OrderItemModel, foreignKey: "orderId" });
    ProductModel.belongsToMany(OrderModel, { through: OrderItemModel, foreignKey: "productId" });
};

export default AssociationConfig;
