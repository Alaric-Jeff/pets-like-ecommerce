import ProductModel from '../models/ProductModel.js';

const getAllProductsController = async (req, res) => {
    try {
        const products = await ProductModel.findAll();

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }
        return res.status(200).json({
            message: "Successfully fetched all products.",
            products
        });

    } catch (error) {
        console.error(`Error occurred in getAllProductsController: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getAllProductsController;
