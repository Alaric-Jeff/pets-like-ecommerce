import fetchOrders from '../controllers/adminFetchOrders.js'
import express from 'express'
const router = express.Router()

router.post('/', fetchOrders)

export default router;