import OrderModel from "../models/OrderModel.js";

const fetchOrders = async (req, res) => {
    try{
       const orders = await OrderModel.findAll()

       if(!orders){
        return res.status(404).json({message: "no orders"})
       }

       console.log(`orders: ${orders}`)
       return res.status(200).json({message: `successfully fetched the orders`, orders })

    }catch(error){
        console.error(`error occured in fetching orders controller`)
        return res.status(500).json({message: "internal server error"})
    }
};

export default fetchOrders;