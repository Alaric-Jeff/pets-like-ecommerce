import express from 'express'
import sendVerificationCode from '../controllers/codeVerification.js';

const router = express.Router()

router.post('/', sendVerificationCode);

export default router;