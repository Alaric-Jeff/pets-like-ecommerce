import addProductController from '../controllers/addProduct.js'
import express from 'express'
import authenticateToken from '../middleware/authenticate.js'

const router = express.Router()

router.post('/', authenticateToken, addProductController)

export default addProductController;