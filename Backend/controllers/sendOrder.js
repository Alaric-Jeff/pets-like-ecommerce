import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

const sendOrderController = async (req, res) => {
    const { userid } = req.user;
    const { orderItems } = req.body;

    if (!userid || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        console.log(`Received incomplete request. User ID: ${userid}`);
        return res.status(400).json({ message: "Incomplete request" });
    }

    console.log(`Received order for user ${userid}:`, orderItems);

    try {
        const validOrders = [];

        for (const item of orderItems) {
            const { productName, quantity, productPrice, cartId } = item;

            if (!productName || !quantity || !productPrice || isNaN(quantity) || isNaN(productPrice) || quantity <= 0) {
                console.warn(`Skipping invalid order item:`, item);
                continue;
            }

            const product = await ProductModel.findOne({ where: { productName } });

            if (!product) {
                console.warn(`Product not found: ${productName}`);
                continue;
            }

            validOrders.push({
                userid,
                productId: product.productId,
                cartId,
                productName,
                quantity,
                productPrice,
                totalPrice: Number(productPrice) * Number(quantity)
            });
        }

        if (validOrders.length === 0) {
            return res.status(400).json({ message: "No valid orders to process" });
        }

        await OrderModel.bulkCreate(validOrders);

        return res.status(200).json({ message: "Successfully sent the order" });
    } catch (error) {
        console.error(`Error in sendOrderController: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default sendOrderController;
