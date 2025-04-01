import fetchOrdersController from '../controllers/adminFetchOrders.js';
import express from 'express';
const router = express.Router();

router.get('/', fetchOrdersController);

export default router;