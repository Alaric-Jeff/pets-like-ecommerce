import UserModel from "../models/UserModel.js"
import productModel from "../models/ProductModel.js"
import OrderModel from "../models/OrderModel.js"
import UserProfileModel from "../models/UserProfileModel.js"
import ProductImage from "../models/ProductImageModel.js"
import ProductReviewModel from "../models/ProductReviewModel.js"

const initializeTableSetup = async ()=> {
    try{
        
        await UserModel.sync({alter: false})
        console.log(`[1] Users' table is initialized`)
        await productModel.sync({alter: false})
        console.log(`[2] Products' table is initialzied`)
        await OrderModel.sync({alter: false})
        console.log(`[3] Orders' table is initialized`)
        await UserProfileModel.sync({alter: false})
        console.log(`[4] Users' profile table is initialized`)
        await ProductImage.sync({alter: false})
        console.log(`[5] Products' images table is initialized`)
        await ProductReviewModel.sync({alter: false})
        console.log(`[6] Products' Reviews table is initialized`)
        
    }catch(error){
        console.log(`error occured in initializing tables`, error)
    }
}

export default initializeTableSetup;