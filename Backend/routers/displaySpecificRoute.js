import displaySpecificProduct from '../controllers/displaySpecificProduct.js'
import express from 'express'

const router = express.Router()

router.get('/:productId', displaySpecificProduct)

export default router;