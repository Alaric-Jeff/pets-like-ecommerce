import sendOrderController from "../controllers/sendOrder.js";
import authenticateToken from '../middleware/authenticate.js'
import express from 'express'


const router = express.Router()

router.post('/', authenticateToken, sendOrderController)

export default router;