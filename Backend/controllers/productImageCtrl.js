import ProductImageModel from "../models/ProductImageModel.js";
import ProductModel from "../models/ProductModel.js";
import logger from "../utils/logger.js";

const uploadProductImageController = async (req, res) => {
    console.log("Received image upload request");

    if (!req.file) {
        logger.warn("No file received");
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { productId } = req.body;

    if (!productId) {
        logger.warn("No product ID received");
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        console.log(`Checking if product exists with ID: ${productId}`);
        const product = await ProductModel.findByPk(productId);

        if (!product) {
            console.log("Product not found");
            return res.status(404).json({ message: "Product not found" });
        }

        const imagePath = `/uploads/products/${req.file.filename}`
        console.log(`Saving image to database: ${imagePath}`)
        const existingImage = await ProductImageModel.findOne({ where: { productId } });

        if (existingImage) {
            await existingImage.update({ image: imagePath });
            logger.info(`Updated image for product ID ${productId}: ${imagePath}`);
        } else {
            await ProductImageModel.create({ productId, image: imagePath });
            logger.info(`New image saved for product ID ${productId}: ${imagePath}`);
        }

        return res.status(200).json({
            message: "File uploaded successfully",
            image: imagePath
        });

    } catch (error) {
        logger.error(`Error saving image: ${error.message}`);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default uploadProductImageController;
