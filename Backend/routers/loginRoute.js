import loginController from '../controllers/loginCtrl.js';
import express from 'express'

const router = express.Router()

router.post('/', loginController);

export default router;