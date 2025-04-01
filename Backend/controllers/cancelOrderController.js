import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

const cancelOrderController = async (req, res) => {
    try {
        console.log("Cancel order request received."); // Debugging log
        const { orderId } = req.body;

        console.log("Request data:", { orderId }); // Debugging log

        if (!orderId) {
            console.log("Order ID is missing."); // Debugging log
            return res.status(400).json({ message: "Order ID is required." });
        }

        // Find the order by ID
        const order = await OrderModel.findOne({
            where: {
                orderId
            }
        });

        if (!order) {
            console.log(`Order not found for order ID: ${orderId}`); // Debugging log
            return res.status(404).json({ message: "Order not found." });
        }

        console.log("Order found:", order); // Debugging log

        // Find the associated product
        const product = await ProductModel.findByPk(order.productId);

        if (!product) {
            console.log(`Product not found for product ID: ${order.productId}`); // Debugging log
            return res.status(404).json({ message: "Product not found." });
        }

        console.log("Product found:", product); // Debugging log

        // Update the product stock (add back the quantity from the canceled order)
        console.log(`Updating product stock. Current stock: ${product.productStock}, Adding back: ${order.quantity}`); // Debugging log
        product.productStock += order.quantity;
        await product.save();
        console.log("Product stock updated successfully."); // Debugging log

        // Delete the order
        console.log(`Deleting order with ID: ${orderId}`); // Debugging log
        await order.destroy();
        console.log("Order deleted successfully."); // Debugging log

        return res.status(200).json({ message: "Order canceled and product stock updated successfully." });
    } catch (error) {
        console.error("Error in cancelOrderController:", error); // Debugging log
        return res.status(500).json({ message: "An error occurred while canceling the order." });
    }
};

export default cancelOrderController;