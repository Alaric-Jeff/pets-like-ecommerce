import express from "express";
import deleteProductController from "../controllers/deleteProduct.js";
import authenticateToken from "../middleware/authenticate.js";

const router = express.Router()

router.post('/',authenticateToken ,deleteProductController)

export default router;
