import ProductModel from "./ProductModel.js";

const updateProductQuantityController = async (req, res) => {
    const { userid } = req.user; 
    const { productId, quantity, operation } = req.body;  

    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (quantity <= 0 || isNaN(quantity)) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        if (operation === "add") {
            product.quantity += quantity;
        }
        else if (operation === "subtract") {
            if (product.quantity - quantity < 0) {
                return res.status(400).json({ message: "Not enough stock to subtract" });
            }
            product.quantity -= quantity;  
        } else {
            return res.status(400).json({ message: "Invalid operation" });
        }
        await product.save();
        return res.status(200).json({ message: "Product quantity updated", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default updateProductQuantityController;
