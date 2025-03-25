import getAllProductsController from "../controllers/getAllProducts.js";
import express from 'express'
import authenticateToken from '../middleware/authenticate.js'
const router = express.Router()

router.get('/', authenticateToken, getAllProductsController);

export default router;