import ProductImageModel from "../models/ProductImageModel.js";
import ProductModel from "../models/ProductModel.js";

const uploadProductImageController = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { productId } = req.body;
    
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
      
        const product = await ProductModel.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const imageUrl = `/uploads/products/${req.file.filename}`;

        const newImage = await ProductImageModel.create({
            productId,
            imageUrl
        });

        res.json({ 
            message: 'File uploaded successfully', 
            imageUrl, 
            imageId: newImage.imageId 
        });
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default uploadProductImageController;
