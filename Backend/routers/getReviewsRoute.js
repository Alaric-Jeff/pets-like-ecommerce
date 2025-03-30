import getReviewsPerProduct from "../controllers/getReviewsPerProduct.js";
import express from 'express'
import authenticateToken from '../middleware/authenticate.js'

const router = express.Router()

router.post('/', authenticateToken, getReviewsPerProduct);

export default router;