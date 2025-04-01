import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

const getAllOrdersController = async (req, res) => {
    try {
        console.log("Fetching all orders with status 'Pending'...");

        const orders = await OrderModel.findAll({
            include: [
                {
                    model: ProductModel,
                    attributes: ["productName", "productPrice"],
                },
                {
                    model: UserModel,
                    attributes: ["firstname", "surname", "email"], 
                }
            ],
            where: {
                orderStatus: "Pending" 
            },
            attributes: ["orderId", "quantity", "totalPrice", "orderStatus", "createdAt", "updatedAt"], 
        });

        console.log("Orders fetched from database:", JSON.stringify(orders, null, 2));

        if (!orders.length) {
            console.warn("No orders found with status 'To Review'.");
            return res.status(404).json({ message: "No orders found." });
        }

        console.log(`Successfully fetched ${orders.length} orders.`);
        return res.status(200).json({
            message: "Orders fetched successfully.",
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default getAllOrdersController;