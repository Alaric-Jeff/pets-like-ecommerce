import fetchSelectedCartController from "../controllers/fetchSelectedCart.js";
import authenticateToken from '../middleware/authenticate.js'
import express from 'express'

const router = express.Router()

router.post('/', authenticateToken, fetchSelectedCartController)

export default router;