import express from 'express'
import verifyCode from '../controllers/verifyCode.js'

const router = express.Router()

router.post('/', verifyCode)

export default router;