import authenticateToken from "../middleware/authenticate.js";
import productController from "../controllers/updateProduct.js";
import express from 'express'

const router = express.Router()

router.post('/', authenticateToken ,productController);

export default router;
