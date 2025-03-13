import UserModel from "../models/UserModel.js"
import productModel from "../models/productsModels.js"
import OrderModel from "../models/OrderModel.js"

const initializeTableSetup = async ()=> {
    try{
        await UserModel.sync({alter: false})
        console.log(`[1] Users' table is initialized`)
        await productModel.sync({alter: false})
        console.log(`[2] Products' table is initialzied`)
        await OrderModel.sync({alter: false})
        console.log(`[3] Orders' table is initialized`)
        
    }catch(error){
        console.log(`error occured in initializing tables`, error)
    }
}

export default initializeTableSetup;