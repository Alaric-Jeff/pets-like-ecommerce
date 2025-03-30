import ProductImageModel from "../models/ProductImageModel.js";
import ProductModel from "../models/ProductModel.js";
import logger from "../utils/logger.js";

const displaySpecificProduct = async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        logger.info("No product id received in the display product controller");
        return res.status(401).json({
            message: "No product Id received"
        });
    }

    try {
        const product = await ProductModel.findOne({
            where: { productId },
            include: {
                model: ProductImageModel,
                attributes: ["image"]
            }
        });

        return res.status(200).json({
            message: `Successfully retrieved product id: ${productId}`,
            product
        });
        
    } catch (error) {
        logger.error("Error occurred in display single product.", error);
        console.error(`error: ${error}`);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default displaySpecificProduct;
