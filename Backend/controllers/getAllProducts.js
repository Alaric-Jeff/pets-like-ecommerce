import ProductModel from '../models/ProductModel.js';
import ProductImageModel from '../models/ProductImageModel.js';
import logger from '../utils/logger.js';

const getAllProductsController = async (req, res) => {
    try {
        const products = await ProductModel.findAll({
            include: [
                {
                    model: ProductImageModel,
                    attributes: ['image']
                }
            ]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }

        const formattedProducts = products.map(product => {
            const productData = product.toJSON();

            productData.image = productData.ProductImage?.image || null;
            delete productData.ProductImage;

            return productData;
        });

        logger.info(`Products fetched successfully: ${JSON.stringify(formattedProducts, null, 2)}`);

        return res.status(200).json({
            message: "Successfully fetched all products.",
            products: formattedProducts
        });

    } catch (error) {
        logger.error(`Error occurred in getAllProductsController: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getAllProductsController;
