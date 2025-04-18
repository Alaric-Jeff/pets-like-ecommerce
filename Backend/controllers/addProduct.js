import { Op } from "sequelize";
import ProductModel from "../models/ProductModel.js";
import logger from "../utils/logger.js";

const addProductController = async (req, res) => {
    try {
        const { 
            productName, 
            description,
            productPrice, 
            productStock, 
            productMeatType, 
        } = req.body;


        if (!productName || !description || !productPrice || !productStock || !productMeatType || 
            !productAgeType || !productBreedType || isHealthTreat === undefined) {

            
            
            console.log("Add product failed: Missing required fields", { 
                productName, description, productPrice, productStock, productMeatType, 
                productAgeType, productBreedType, isHealthTreat
            });

            return res.status(400).json({ message: "Incomplete fields" });
        }

        const parsedPrice = parseFloat(productPrice).toFixed(2);
        const parsedStock = parseInt(productStock, 10);

        if (isNaN(parsedPrice) || isNaN(parsedStock)) {
            logger.warn(`Invalid data: productPrice (${productPrice}) or productStock (${productStock}) is not a number.`);
            return res.status(400).json({ message: "Invalid price or stock value" });
        }

        let product = await ProductModel.findOne({
            where: {
                productName: { [Op.eq]: productName }  
            }
        });

        if (product) {
            await product.update({ productStock: product.productStock + parsedStock });

            logger.info(`Stock updated for '${productName}': New stock = ${product.productStock}`);
            return res.status(200).json({ message: `Updated stock for ${productName}` });
        }

        const newProduct = await ProductModel.create({
            productName,
            description,
            productPrice: parsedPrice,
            productStock: parsedStock,
            productMeatType,
            productAgeType,
            productBreedType,
            isHealthTreat
        });

        const productId = newProduct.getDataValue("productId"); 

        logger.info(`New product added: '${productName}', Price: ${parsedPrice}, Stock: ${parsedStock}`);
        return res.status(201).json({ message: `Product '${productName}' added successfully`, productId });

    } catch (error) {
        logger.error(`Error in addProductController: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default addProductController;
