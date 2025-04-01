import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductImageModel from "../models/ProductImageModel.js";
import logger from "../utils/logger.js";

const fetchCartController = async (req, res) => {
    const { userid } = req.user;
    if (!userid) {
        logger.warn("Incomplete request: missing userid");
        return res.status(400).json({ message: "Bad request: missing userid" });
    }
    try {
        const userCart = await CartModel.findAll({
            where: { userid, isOrdered: false },
            include: [{
                model: ProductModel,
                include: [{
                    model: ProductImageModel,
                    attributes: ["image"]
                }],
                attributes: ["productId", "productName", "productPrice", "productStock"]
            }]
        });
        if (userCart.length === 0) {
            logger.info(`User ${userid} has an empty cart.`);
            return res.status(200).json({ cart: [], message: "No cart items found" });
        }
        logger.info(`Fetched cart for user ${userid} with ${userCart.length} items.`);
        console.log(userCart);
        return res.status(200).json({
            cart: userCart,
            message: `Successfully fetched ${userCart.length} cart items.`
        });
    } catch (error) {
        logger.error(`Error fetching cart for user ${userid}: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchCartController;
