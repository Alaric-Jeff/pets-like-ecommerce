import authenticateToken from '../middleware/authenticate.js'
import express from 'express'
import addProductReviewController from '../controllers/addProductReviewController.js'
const router = express.Router()     


router.post('/', authenticateToken,addProductReviewController)
export default router;