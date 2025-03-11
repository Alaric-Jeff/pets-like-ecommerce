import UserModel from "../models/usermodel.js";


const initializeTableSetup = async ()=> {
    try{
        await UserModel.sync({alter: false})
        console.log("[1] User's table is initialized")
    }catch(error){
        console.log(`error occured in initializing tables`)
    }
}

export default initializeTableSetup;