import { Op } from "sequelize";
import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductImageModel from "../models/ProductImageModel.js";
import logger from "../utils/logger.js";

const fetchSelectedCartController = async (req, res) => {
  const { userid } = req.user;
  let { cartId } = req.body;
  
  if (!userid) {
    logger.warn("Incomplete request: missing userid");
    return res.status(400).json({ message: "Bad request: missing userid" });
  }
  if (!cartId) {
    logger.warn("Incomplete request: missing cartId");
    return res.status(400).json({ message: "Bad request: missing cartId" });
  }
  if (!Array.isArray(cartId)) {
    cartId = [cartId];
  }
  
  try {
    const userCart = await CartModel.findAll({
      where: {
        userid,
        cartId: { [Op.in]: cartId }
      },
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
      logger.info(`User ${userid} has no selected cart items.`);
      return res.status(200).json({ cart: [], message: "No selected cart items found" });
    }
    logger.info(`Fetched ${userCart.length} selected cart items for user ${userid}.`);
    return res.status(200).json({
      cart: userCart,
      message: `Successfully fetched ${userCart.length} selected cart items.`
    });
  } catch (error) {
    logger.error(`Error fetching selected cart items for user ${userid}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchSelectedCartController;
