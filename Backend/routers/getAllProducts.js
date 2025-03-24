import getAllProductsController from "../controllers/getAllProducts.js";
import express from 'express'
const router = express.Router()

router.get('/', getAllProductsController);

export default router;