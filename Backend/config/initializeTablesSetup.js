import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import ProductImageModel from "../models/ProductImageModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";
import CartModel from "../models/CartModel.js";
import ProfileImageModel from "../models/ProfileImageModel.js";
import logger from "../utils/logger.js";


const initializeTableSetup = async () => {
    logger.info("• Initializing Tables.....")
    try {
        await Promise.all([
            UserModel.sync({ alter: false }).then(() => logger.info("• Users' table initialized")),
            ProductModel.sync({ alter: false }).then(() => logger.info("• Products' table initialized")),
            OrderModel.sync({ alter: false }).then(() => logger.info("• Orders' table initialized")),
            UserProfileModel.sync({ alter: false }).then(() => logger.info("• Users' profile table initialized")),
            ProductImageModel.sync({ alter: false }).then(() => logger.info("• Products' images table initialized")),
            ProductReviewModel.sync({ alter: false }).then(() => logger.info("• Products' reviews table initialized")),
            CartModel.sync({ alter: false }).then(() => logger.info("• Carts table initialized")),
            ProfileImageModel.sync({ alter: false }).then(() => logger.info("• Profile Image table initialized"))
        ]);

        logger.info("All tables successfully initialized!");

    } catch (error) {
        console.error(`error: ${error}`)
        logger.error(`Error initializing tables: ${error.message}`);
    }
};

export default initializeTableSetup;
