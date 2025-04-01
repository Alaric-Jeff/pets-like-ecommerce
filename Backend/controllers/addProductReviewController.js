import ProductReviewModel from "../models/ProductReviewModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

const addProductReviewController = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from the request parameters
        const { userid, rating, reviewText, liked } = req.body; // Extract review details from the request body

        // Validate input
        if (!productId || !userid || !rating || !reviewText) {
            return res.status(400).json({ message: "All fields are required: productId, userid, rating, reviewText." });
        }

        // Check if the product exists
        const product = await ProductModel.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check if the user exists
        const user = await UserModel.findByPk(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the rating is within the valid range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        // Create the review
        const newReview = await ProductReviewModel.create({
            productId,
            userid,
            rating,
            reviewText,
            likes: liked ? 1 : 0 // Increment likes if the user liked the product
        });

        return res.status(201).json({
            message: "Review added successfully.",
            review: newReview
        });
    } catch (error) {
        console.error("Error adding product review:", error);
        return res.status(500).json({ message: "An error occurred while adding the review." });
    }
};

export default addProductReviewController;