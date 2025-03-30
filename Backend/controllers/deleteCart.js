import { Op } from "sequelize";
import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const deleteCart = async (req, res) => {
  const { cartId } = req.body;
  console.log(`Received cartId for deletion:`, cartId);

  if (!Array.isArray(cartId) || cartId.length === 0) {
    logger.warn("Missing or invalid cartId in request body");
    return res.status(400).json({ message: "cartId must be provided as a non-empty array" });
  }

  try {
    const deletedCount = await CartModel.destroy({
      where: { cartId: { [Op.in]: cartId } } 
    });

    if (deletedCount === 0) {
      logger.warn(`No cart items found for the provided cartId: ${cartId}`);
      return res.status(404).json({ message: "No cart items found" });
    }

    logger.info(`Deleted ${deletedCount} cart items for cartId: ${cartId}`);
    return res.status(200).json({ message: "Cart items deleted successfully", deletedCount });
  } catch (error) {
    logger.error(`Error deleting cart items for cartId ${cartId}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteCart;
