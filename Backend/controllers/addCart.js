import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const addToCartController = async (req, res) => {
    const { userid, productId, productName, quantity } = req.body;
    if (!userid || !productId || !productName || !quantity || quantity <= 0) {
        logger.warn(`Invalid request - userid: ${userid}, productId: ${productId}, productName: ${productName}, quantity: ${quantity}`);
        return res.status(400).json({ message: "Invalid or incomplete fields" });
    }

    try {
        const existingCart = await CartModel.findOne({ where: { userid, productId } });

        if (existingCart) {
            await existingCart.increment("quantity", { by: parseInt(quantity, 10) });
            await existingCart.reload();

            logger.info(`User ${userid} updated cart: productId: ${productId}, productName: ${productName}, new quantity: ${existingCart.quantity}`);
            return res.status(200).json({ 
                message: "Quantity updated in cart",
                cart: existingCart
            });
        }

        const newCart = await CartModel.create({ userid, productId, productName, quantity });

        logger.info(`User ${userid} added product ${productName} to cart`);
        return res.status(201).json({ 
            message: "Product successfully added to cart",
            cart: newCart
        });

    } catch (error) {
        logger.error(`Error in addToCartController: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default addToCartController;
