import addToCartController from "../controllers/addCart.js";
import express from 'express'
const router = express.Router()

router.post('/', addToCartController)

export default router;