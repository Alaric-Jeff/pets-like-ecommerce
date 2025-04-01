import ProductReviewModel from "../models/ProductReviewModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

const addProductReviewController = async (req, res) => {
    try {
        console.log("Request received to add a product review.");
        console.log("Request body:", req.body);

        const { userid, productId, rating, reviewText, liked } = req.body;

        if (!productId || !userid || !rating || !reviewText) {
            console.log("Validation failed: Missing required fields.");
            return res.status(400).json({ message: "All fields are required: productId, userid, rating, reviewText." });
        }

        console.log(`Checking if product with ID ${productId} exists.`);
        const product = await ProductModel.findByPk(productId);
        if (!product) {
            console.log(`Product with ID ${productId} not found.`);
            return res.status(404).json({ message: "Product not found." });
        }

        console.log(`Checking if user with ID ${userid} exists.`);
        const user = await UserModel.findByPk(userid);
        if (!user) {
            console.log(`User with ID ${userid} not found.`);
            return res.status(404).json({ message: "User not found." });
        }

        if (rating < 1 || rating > 5) {
            console.log(`Validation failed: Rating ${rating} is out of range.`);
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        console.log("Creating a new product review.");
        const newReview = await ProductReviewModel.create({
            productId,
            userid,
            rating,
            reviewText,
            likes: liked ? 1 : 0
        });

        console.log("Review created successfully:", newReview);

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