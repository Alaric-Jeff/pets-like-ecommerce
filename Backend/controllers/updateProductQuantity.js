import ProductModel from "../models/ProductModel.js";

const updateProductQuantityController = async (req, res) => {
    const { userid } = req.user;
    const { productIds, productId, quantity, operation } = req.body;
    
    let productIdArray = [];
    if (Array.isArray(productIds)) {
        productIdArray = productIds;
    } else if (productId) {
        productIdArray = [productId];
    } else {
        return res.status(400).json({ message: "No productId(s) provided" });
    }

    if (quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
        const updatedProducts = [];
        for (const id of productIdArray) {
            const product = await ProductModel.findByPk(id);

            if (!product) {
                continue;
            }

            if (operation === "add") {
                product.productStock += quantity;
            } else if (operation === "subtract") {
                if (product.productStock - quantity < 0) {
                    continue;
                }
                product.productStock -= quantity;
            } else {
                return res.status(400).json({ message: "Invalid operation" });
            }

            await product.save();
            updatedProducts.push(product);
        }

        return res.status(200).json({ message: "Product quantity updated", products: updatedProducts });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateProductQuantityController;