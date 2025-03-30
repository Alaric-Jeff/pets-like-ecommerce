import deleteCart from "../controllers/deleteCart.js";
import express from 'express'

const router = express.Router()

router.post('/', deleteCart);

export default router;