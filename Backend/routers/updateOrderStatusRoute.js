import updateOrderStatus from "../controllers/updateOrderStatus.js";
import express from 'express'
import authenticateToken from "../middleware/authenticate.js";
const router = express.Router()

router.post('/', authenticateToken, updateOrderStatus);

export default router;
