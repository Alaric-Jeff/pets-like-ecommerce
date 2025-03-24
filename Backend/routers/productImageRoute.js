import express from 'express';
import { uploadProductImage } from "../middleware/uploadsHandler.js";
import uploadProductImageController from '../controllers/productImageCtrl.js';
const router = express.Router();


router.post('/', uploadProductImage.single('image'), uploadProductImageController);

export default router;
