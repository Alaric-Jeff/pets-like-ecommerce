import ProductModel from "../models/ProductModel.js";
import ProductReviewModel from "../models/ProductReviewModel.js";
import ReviewLikeModel from "../models/ReviewLikeModel.js";
import logger from "../utils/logger.js";

const getReviewsPerProduct = async (req, res) => {
    const { userid } = req.user;
    const { productId } = req.body;
    if (!userid || !productId) {
        logger.error("Incomplete fields in get reviews controller");
        console.log(`user id: ${userid} \n product ID: ${productId}`);
        return res.status(401).json({ message: "Missing user ID or product ID" });
    }

    try {
        const reviews = await ProductReviewModel.findAll({
            where: { productId },
            include: [
                {
                    model: ReviewLikeModel,
                    as: "ReviewLikes",  
                    where: { userId: userid },
                    required: false 
                }
            ]
        });
        return res.status(200).json({
            message: "Reviews retrieved successfully",
            reviews
        });
    } catch (error) {
        logger.error("Error in getReviewsPerProduct:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getReviewsPerProduct;
