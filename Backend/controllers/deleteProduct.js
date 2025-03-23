import ProductModel from "../models/ProductModel.js";
import logger from "../utils/logger.js";

const deleteProductController = async (req, res) => {
    console.log("Backend: Received request body ->", req.body); // Debug Log

    const { productId } = req.body; // Fix casing: `productId` not `productid`

    if (!productId) {
        logger.warn("Delete request failed: Missing productId");
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const product = await ProductModel.findOne({ where: { productId } });

        if (!product) {
            logger.warn(`Delete request failed: Product ID ${productId} not found`);
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();
        logger.info(`Product deleted successfully: ID ${productId}`);

        return res.status(200).json({ message: "Successfully deleted product" });
    } catch (error) {
        logger.error(`Error in deleteProductController: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default deleteProductController;
