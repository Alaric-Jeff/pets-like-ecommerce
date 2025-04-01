import { Op } from "sequelize";
import CartModel from "../models/CartModel.js";
import logger from "../utils/logger.js";

const deleteCart = async (req, res) => {
  const { cartId } = req.body;
  console.log(`Received cartId for deletion:`, cartId);

  if (!Array.isArray(cartId) || cartId.length === 0) {
    console.log("Validation failed: cartId is not a non-empty array");
    logger.warn("Missing or invalid cartId in request body");
    return res.status(400).json({ message: "cartId must be provided as a non-empty array" });
  }

  try {
    console.log("Attempting to delete cart items with cartId:", cartId);
    const deletedCount = await CartModel.destroy({
      where: { cartId: { [Op.in]: cartId } } 
    });

    console.log(`Delete operation completed. Deleted count: ${deletedCount}`);
    if (deletedCount === 0) {
      console.log(`No cart items found for cartId: ${cartId}`);
      logger.warn(`No cart items found for the provided cartId: ${cartId}`);
      return res.status(404).json({ message: "No cart items found" });
    }

    console.log(`Successfully deleted ${deletedCount} cart items for cartId: ${cartId}`);
    logger.info(`Deleted ${deletedCount} cart items for cartId: ${cartId}`);
    return res.status(200).json({ message: "Cart items deleted successfully", deletedCount });
  } catch (error) {
    console.log(`Error occurred while deleting cart items for cartId ${cartId}:`, error);
    logger.error(`Error deleting cart items for cartId ${cartId}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteCart;