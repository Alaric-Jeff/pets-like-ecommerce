import signupController from '../controllers/signupCtrl.js';
import express from 'express'

const router = express.Router()

router.post('/', signupController)

export default router;