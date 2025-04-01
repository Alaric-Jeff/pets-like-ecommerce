import express from 'express'
import addProductReviewController from '../controllers/addProductReviewController.js'
const router = express.Router()     

router.post('/:productId', addProductReviewController)
export default router;