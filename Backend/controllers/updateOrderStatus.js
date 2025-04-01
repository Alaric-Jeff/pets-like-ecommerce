import { Op } from "sequelize";
import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const updateOrderStatus = async (req, res) => {
    const { userid } = req.user;
    let { cartId } = req.body;

    if (!userid || !cartId) {
        logger.warn("Missing userid or cartId in request body");
        return res.status(400).json({ message: "Bad request: userid and cartId are required" });
    }

    if (!Array.isArray(cartId)) {
        cartId = [cartId];
    }

    try {
        const existingCarts = await CartModel.findAll({
            where: { userid, cartId: { [Op.in]: cartId }, isOrdered: false }
        });

        if (existingCarts.length === 0) {
            logger.warn(`No matching cart items found for user ${userid}`);
            return res.status(404).json({ message: "No matching cart items found to update" });
        }

        const validCartIds = existingCarts.map(cart => cart.cartId);

        await CartModel.update(
            { isOrdered: true },
            { where: { cartId: { [Op.in]: validCartIds } } }
        );

        logger.info(`Updated order status for cartId(s) ${validCartIds} of user ${userid}`);
        return res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        logger.error(`Error updating order status: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateOrderStatus;
