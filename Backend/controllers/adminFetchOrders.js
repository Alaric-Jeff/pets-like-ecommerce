import OrderModel from '../models/OrderModel.js';
import ProductModel from '../models/ProductModel.js';
import ProductImageModel from '../models/ProductImageModel.js';
import logger from '../utils/logger.js';

const fetchOrdersController = async (req, res) => {
    try {
        console.log(`this is being called`)

        const orders = await OrderModel.findAll({
            include: [
                {
                    model: ProductModel,
                    include: [
                        {
                            model: ProductImageModel,
                            attributes: ['image'] 
                        }
                    ]
                }
            ]
        });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        logger.info(`Successfully fetched ${orders.length} ordersm in fetchOrdersController`);
        console.log(orders)
        return res.status(200).json({
            message: "Successfully fetched all orders.",
            orders
        });

    } catch (error) {
        logger.error(`Error occurred in fetching orders: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchOrdersController;
