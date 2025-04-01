import updateCartModelQuantity from "../controllers/cartUpdateQuantity.js";
import authenticateToken from "../middleware/authenticate.js";
import express from 'express'
import updateProductQuantityController from "../models/updateProductQuantity.js";

const router = express.Router()

router.post('/', authenticateToken, updateProductQuantityController)

export default router;