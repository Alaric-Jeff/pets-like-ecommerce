import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const fetchCartController = async (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        logger.warn("Incomplete request: missing userid");
        return res.status(400).json({ message: "Bad request: missing userid" });
    }

    try {
        const userCart = await CartModel.findAll({ where: { userid } });

        if (userCart.length === 0) {
            logger.info(`User ${userid} has an empty cart.`);
            return res.status(404).json({ message: "No cart items found" });
        }

        logger.info(`Fetched cart for user ${userid} with ${userCart.length} items.`);
        return res.status(200).json({
            cart: userCart,
            message: `successfully fetched carts: ${userCart}`
        });

    } catch (error) {
        logger.error(`Error fetching cart for user ${userid}: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchCartController;
