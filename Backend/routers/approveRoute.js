import approveOrderController from "../controllers/approvedController.js";
import express from "express";
const router = express.Router();

router.post("/", approveOrderController);

export default router;