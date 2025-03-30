import getUserInfo from "../controllers/userInfo.js";
import express from 'express'
import authenticateToken from '../middleware/authenticate.js'
const router = express.Router()

router.get('/', authenticateToken, getUserInfo);

export default router;
