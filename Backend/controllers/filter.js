import ProductModel from "../models/ProductModel.js";

const filterController = async (req, res) => {
    const {productMeatType, productAgeType, productBreedType, productisHealthTreat} = req.body;

    try{

        const products = {

        }

        return res.status(200).json({message: "successful "})

    }catch(error){
        console.error(`error occured in filterjs, error: ${error}`)
        return res.status(401).json({message: "internal server error"})
    }

};
    
export default filterController;