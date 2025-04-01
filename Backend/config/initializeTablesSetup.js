import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import ProductImageModel from "../models/ProductImageModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";
import CartModel from "../models/CartModel.js";
import ProfileImageModel from "../models/ProfileImageModel.js";
import ReviewLikeModel from "../models/ReviewLikeModel.js";
import logger from "../utils/logger.js";

const initializeTableSetup = async () => {
    logger.info("• Initializing Tables.....");
    try {
        await UserModel.sync({ alter: false });
        logger.info("[1]. Users' table initialized");
        
        await ProductModel.sync({ alter: false });
        logger.info("[2] Products' table initialized");
        
        await OrderModel.sync({ alter: false });
        logger.info("[3] Orders' table initialized");
        
        await UserProfileModel.sync({ alter: false });
        logger.info("[4] Users' profile table initialized");
        
        await ProductImageModel.sync({ alter: false });
        logger.info("[5] Products' images table initialized");
        
        await ProductReviewModel.sync({ alter: false });
        logger.info("[6] Products' reviews table initialized");
        
        await CartModel.sync({ alter: false });
        logger.info("[7] Carts table initialized");
        
        await ProfileImageModel.sync({ alter: false });
        logger.info("[8] Profile Image table initialized");
        
        await ReviewLikeModel.sync({ alter: false });
        logger.info("[9] Review's Like table initialized");
        
        logger.info("All tables successfully initialized!");
    } catch (error) {
        console.error(`error: ${error}`);
        logger.error(`Error initializing tables: ${error.message}`);
    }
};

export default initializeTableSetup;
