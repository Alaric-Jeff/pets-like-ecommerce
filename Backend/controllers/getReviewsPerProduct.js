import ProductReviewModel from "../models/ProductReviewModel.js";
import UserModel from "../models/UserModel.js";
import logger from "../utils/logger.js";

const getReviewsPerProduct = async (req, res) => {
    try {
        console.log("Request received to get reviews for a product.");
        const { userid } = req.user;
        const { productId } = req.body;

        if (!userid || !productId) {
            logger.error("Validation failed: Missing user ID or product ID.");
            return res.status(400).json({ message: "Missing user ID or product ID." });
        }
        console.log(`User ID: ${userid}, Product ID: ${productId}`);
        console.log(`Fetching reviews for product ID: ${productId}.`);
        const reviews = await ProductReviewModel.findAll({
            where: { productId },
            attributes: ["reviewText", "rating"], // Only include reviewText and rating
            include: [
                {
                    model: UserModel,
                    attributes: ["firstname", "surname"] // Only include firstname and surname
                }
            ]
        });

        console.log(`Retrieved ${reviews.length} reviews for product ID: ${productId}.`);
        return res.status(200).json({
            message: "Reviews retrieved successfully.",
            reviews
        });
    } catch (error) {
        logger.error("Error in getReviewsPerProduct:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default getReviewsPerProduct;