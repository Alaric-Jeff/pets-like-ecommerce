import fetchOrders from "../controllers/fetchSelectedOrders.js";
import authenticateToken from "../middleware/authenticate.js";
import express from 'express'

const router = express.Router()

router.post('/', authenticateToken, fetchOrders);

export default router;