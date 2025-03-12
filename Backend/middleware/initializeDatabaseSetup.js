import {connectDB} from '../config/database.js'

const initializeDatabaseSetup = async ()=> {
    try{
        await connectDB()
    }catch(error){
        console.log(`error in database setup initialization: ${error}`)
    }
}

export default initializeDatabaseSetup;