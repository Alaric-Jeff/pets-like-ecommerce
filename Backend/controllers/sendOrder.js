import OrderModel from '../models/UserModel.js'

const sendOrderController = async (req, res) =>{
    const {userid, orderId, productName, orderQuantity, productPrice} = req.body;

    if(!userid || !orderId || !productName || !orderQuantity || !productPrice){
        console.log(`recieved fields in send order, order id: ${orderId}, user id: ${userid}`)
        return res.status(401).json({message: "incomplete request"})
    }

    try{
        await OrderModel.create({userid, productName, orderQuantity, productPrice, 
            totalSum: Number(productName.price) * Number(orderQuantity)
        })

        return res.status(200).json({message: "successfully sent the order"})
    }catch(error){
        console.error(`error occured in send order controller`)
        return res.status(500).json({message: "internal server error"})
    }

}

export default sendOrderController;