import fetchCartController from "../controllers/fetchCart.js";
import authenticateToken from "../middleware/authenticate.js";
import express from 'express'
const router = express.Router()

router.get('/', authenticateToken, fetchCartController);

export default router;