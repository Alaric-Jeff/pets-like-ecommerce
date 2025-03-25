import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const addToCartController = async (req, res) => {
    const { userid, productId, quantity } = req.body;

    if (!userid || !productId || !quantity || quantity <= 0) {
        logger.warn(`Invalid request - userid: ${userid}, productId: ${productId}, quantity: ${quantity}`);
        return res.status(400).json({ message: "Invalid or incomplete fields" });
    }

    try {
        const existingCart = await CartModel.findOne({ where: { userid, productId } });

        if (existingCart) {
            await existingCart.increment("quantity", { by: parseInt(quantity) }); 
            await existingCart.reload(); 

            logger.info(`User ${userid} updated cart: Product ${productId}, new quantity: ${existingCart.quantity}`);
            return res.status(409).json({ 
                message: "Quantity updated in cart",
                cart: existingCart
            });
        }

        const newCart = await CartModel.create({ userid, productId, quantity });

        logger.info(`User ${userid} added Product ${productId} to cart`);
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
