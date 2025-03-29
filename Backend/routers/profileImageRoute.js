import ProfileImageController from "../controllers/profileImageCtrl.js";
import authenticateToken from '../middleware/authenticate.js'
import { uploadProfilePicture } from "../middleware/uploadsHandler.js";
import uploadProductImageController from '../controllers/productImageCtrl.js';
import express from 'express'

const router = express.Router()

router.post('/', authenticateToken ,uploadProfilePicture.single('image'), ProfileImageController);

export default router;
