import updateCartQuantity from "../controllers/cartUpdateQuantity.js";
import express from 'express'


const router = express.Router()

router.post('/', updateCartQuantity)

export default router;