import ProductModel from "../models/ProductModel.js";

const addProductController = async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            productStock, 
            productMeatType, 
            productAgeType, 
            productBreedType, 
            isHealthTreat 
        } = req.body;

        if (!productName || !productPrice || !productStock || !productMeatType || 
            !productAgeType || !productBreedType || isHealthTreat === undefined) {
            console.log(`Received fields:
                Product Name: ${productName}
                Stock: ${productStock}
                Price: ${productPrice}
                Meat Type: ${productMeatType}
                Age Type: ${productAgeType}
                Breed Type: ${productBreedType}
                Health Treat: ${isHealthTreat}
            `);
            return res.status(400).json({ message: "Incomplete fields" });
        }
        let product = await ProductModel.findOne({ where: { productName } });

        if (product) {
            await product.update({
                productStock: product.productStock + Number(productStock)
            });

            return res.status(200).json({ message: `Updated stock and price for ${productName}` });
        }

        await ProductModel.create({
            productName,
            productPrice,
            productStock,
            productMeatType,
            productAgeType,
            productBreedType,
            isHealthTreat
        });

        return res.status(201).json({ message: `Product '${productName}' added successfully` });

    } catch (error) {
        console.error(`Error occurred: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default addProductController;
