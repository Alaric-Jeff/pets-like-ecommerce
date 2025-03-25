import OrderModel from '../models/OrderModel.js'; 

const sendOrderController = async (req, res) => {
    const { userid, productName, orderQuantity, productPrice } = req.body;

    console.log(`received field: userid: ${userid}, productName: ${productName}, orderQuantity: ${orderQuantity}, productPrice: ${productPrice}`);

    if (!userid || !productName || !orderQuantity || !productPrice) {
        console.log(`Received incomplete request. User ID: ${userid}`);
        return res.status(400).json({ message: "Incomplete request" });
    }

    try {
        await OrderModel.create({
            userid,
            productName,
            orderQuantity,
            productPrice,
            totalSum: Number(productPrice) * Number(orderQuantity) 
        });

        return res.status(200).json({ message: "Successfully sent the order" });
    } catch (error) {
        console.error(`Error in sendOrderController: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default sendOrderController;
