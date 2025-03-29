import getProfile from "../controllers/getProfile.js";
import authenticateToken from "../middleware/authenticate.js";
import express from 'express'

const router = express.Router()

router.get('/', authenticateToken, getProfile)

export default router;


