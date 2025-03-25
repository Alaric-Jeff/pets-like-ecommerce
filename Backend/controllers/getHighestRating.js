import ProductModel from '../models/ProductModel.js';

const getHighestRating = async (req, res) => {
    try {
        const highestRatingProducts = await ProductModel.findAll({
            order: [['rating', 'DESC']],
            limit: 10 
        });

        return res.status(200).json({ 
            message: "Successfully fetched highest-rated products", 
            products: highestRatingProducts 
        });

    } catch (error) {
        console.error(`Error in getHighestRating: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getHighestRating;
