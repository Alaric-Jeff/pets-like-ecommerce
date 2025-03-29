import fetchCartController from "../controllers/fetchCart.js";
import express from 'express'
const router = express.Router()

router.get('/:userid', fetchCartController);

export default router;