import getProfile from "../controllers/getProfile.js";
import express from 'express'

const router = express.Router()

router.get('/', getProfile)

export default router;


