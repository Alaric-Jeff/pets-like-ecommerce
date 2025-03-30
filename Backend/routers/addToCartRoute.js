import addToCartController from "../controllers/addCart.js";
import authenticateToken from "../middleware/authenticate.js";
import express from 'express'
const router = express.Router()

router.post('/', authenticateToken,addToCartController)

export default router;