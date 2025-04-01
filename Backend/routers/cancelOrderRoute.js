import cancelOrderController from "../controllers/cancelOrderController.js";
import express from "express";
import authenticateToken from "../middleware/authenticate.js"

const router = express.Router();

router.post("/", authenticateToken, cancelOrderController);

export default router;