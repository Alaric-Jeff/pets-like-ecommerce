import ProductModel from "../models/ProductModel.js";
import logger from "../utils/logger.js";

const updateProductController = async (req, res) => {
    try {
        const { 
            productId, 
            productName, 
            description,
            productPrice, 
            productStock, 
            productMeatType, 
            productAgeType, 
            productBreedType, 
            isHealthTreat 
        } = req.body;

        console.log(`Received update request for product with ID: ${productId}`);
        console.log(`Description: ${description}`);

        logger.info(`Checking if product with ID '${productId}' exists...`);
        const product = await ProductModel.findOne({ where: { productId } });

        if (!product) {
            logger.warn(`Update failed: Product with ID '${productId}' not found.`);
            return res.status(404).json({ message: "Product not found" });
        }

        logger.info(`Checking for duplicate product name conflicts for '${productName}'...`);
        const duplicateProduct = await ProductModel.findOne({ 
            where: { productName, productId: { $ne: productId } }  
        });

        if (duplicateProduct) {
            logger.warn(`Update failed: Product name '${productName}' already in use.`);
            return res.status(409).json({ message: "Product name already in use" });
        }

        // Log the fields before updating
        logger.info(`Updating product with new details: ${JSON.stringify({
            productName,
            description,  
            productStock,
            productPrice,
            productMeatType,
            productAgeType,
            productBreedType,
            isHealthTreat
        })}`);

        await product.update({
            productName,
            description,  
            productStock,
            productPrice,
            productMeatType,
            productAgeType,
            productBreedType,
            isHealthTreat
        });

        logger.info(`Product with ID '${productId}' updated successfully.`);
        return res.status(200).json({ message: `Product '${productName}' updated successfully` });

    } catch (error) {
        logger.error(`Error updating product '${req.body?.productId || "unknown"}': ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateProductController;
