import { Op } from "sequelize";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductImageModel from "../models/ProductImageModel.js";

const fetchOrders = async (req, res) => {
    const { userid } = req.user;
    const { selectedCartItems } = req.body;

    console.log(`Received fetch order request for user: ${userid}`);
    console.log(`Selected Order Items:`, selectedCartItems);

    if (!selectedCartItems || !Array.isArray(selectedCartItems) || selectedCartItems.length === 0) {
        console.warn("No selected orders provided or invalid format");
        return res.status(400).json({ message: "No selected orders provided" });
    }

    // Extract cartId and related details properly
    const cartIds = selectedCartItems.map(item => Number(item.cartId)).filter(id => !isNaN(id));
    
    console.log("Parsed Cart IDs:", cartIds);

    if (cartIds.length === 0) {
        return res.status(400).json({ message: "No valid cart IDs provided" });
    }

    try {
        console.log("Fetching orders from database...");
        const userOrders = await OrderModel.findAll({
            where: { 
                userid,
                cartId: { [Op.in]: cartIds }
            },
            include: [
                {
                    model: ProductModel,
                    include: [{
                        model: ProductImageModel,
                        attributes: ["image"]
                    }],
                    attributes: ["productId", "productName", "productPrice", "productStock"]
                }
            ],
            attributes: ["cartId", "quantity", "productPrice", "totalPrice", "createdAt"]
        });

        console.log("Orders retrieved:", userOrders.length);

        if (!userOrders || userOrders.length === 0) {
            console.warn("No matching orders found for the given IDs");
            return res.status(404).json({ message: "No selected orders found" });
        }

        console.log("Returning fetched orders to client");
        return res.status(200).json({ orders: userOrders });
    } catch (error) {
        console.error(`Error in fetchOrders controller: ${error.message}`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default fetchOrders;