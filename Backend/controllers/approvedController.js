import OrderModel from "../models/OrderModel.js";
import nodeschedule from "node-schedule";
import logger from "../utils/logger.js";

const approveOrderController = async (req, res) => {
    let { orderId } = req.params;
    let { orderIds } = req.body; 
    if (orderId) {
        orderIds = [orderId];
    }

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        logger.warn("No order IDs provided or invalid format.");
        return res.status(400).json({ message: "Please provide a valid order ID or an array of order IDs." });
    }

    try {
        const approvedOrders = [];

        for (const id of orderIds) {
            const order = await OrderModel.findByPk(id);

            if (!order) {
                logger.warn(`Order with ID ${id} not found.`);
            }

            order.orderStatus = "Approved";
            await order.save();
            approvedOrders.push(id);

            logger.info(`Order with ID ${id} approved.`);
            nodeschedule.scheduleJob(new Date(Date.now() + 5000), async () => {
                try {
                    const updatedOrder = await OrderModel.findByPk(id);
                    if (updatedOrder && updatedOrder.orderStatus === "Approved") {
                        updatedOrder.orderStatus = "To Receive";
                        await updatedOrder.save();
                        logger.info(`Order with ID ${id} status updated to "To Receive".`);
                    }
                } catch (error) {
                    logger.error(`Error updating order ID ${id} to "To Receive": ${error.message}`);
                }
            });

            nodeschedule.scheduleJob(new Date(Date.now() + 10000), async () => {
                try {
                    const updatedOrder = await OrderModel.findByPk(id);
                    if (updatedOrder && updatedOrder.orderStatus === "To Receive") {
                        updatedOrder.orderStatus = "Order Received";
                        await updatedOrder.save();
                        logger.info(`Order with ID ${id} status updated to "Order Received".`);
                    }
                } catch (error) {
                    logger.error(`Error updating order ID ${id} to "Order Received": ${error.message}`);
                }
            });
        }

        if (approvedOrders.length === 0) {
            return res.status(404).json({ message: "No valid orders found to approve." });
        }

        res.status(200).json({
            message: "Orders approved successfully.",
            approvedOrders,
        });
    } catch (error) {
        logger.error(`Error approving orders: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

export default approveOrderController;