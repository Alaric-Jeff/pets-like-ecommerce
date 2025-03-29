import fetchOrdersController from '../controllers/adminFetchOrders.js';
import express from 'express'
const router = express.Router()

router.post('/', fetchOrdersController)

export default router;