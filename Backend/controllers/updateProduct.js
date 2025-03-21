import ProductModel from "../models/ProductModel.js";

const productController = async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            productStock, 
            productMeatType, 
            productAgeType, 
            productBreedType, 
            isHealthTreat 
        } = req.body;
        if (!productName || !productPrice || !productStock || !productMeatType || 
            !productAgeType || !productBreedType || isHealthTreat === undefined) {
            return res.status(400).json({ message: "Incomplete fields" });
        }
        const product = await ProductModel.findOne({ where: { productName } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const duplicateProduct = await ProductModel.findOne({ 
            where: { productName },
        });

        if (duplicateProduct && duplicateProduct.id !== product.id) {
            return res.status(409).json({ message: "Product name already in use" });
        }

        await product.update({
            productName,
            productStock,
            productPrice,
            productMeatType,
            productAgeType,
            productBreedType,
            isHealthTreat
        });

        return res.status(200).json({ message: `Product '${productName}' updated successfully` });

    } catch (error) {
        console.error(`Error in update products: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default productController;
