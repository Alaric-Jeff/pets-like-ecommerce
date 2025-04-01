import getAllOrdersController from "../controllers/getAllAdminOrder.js";
import express from "express";
const router = express.Router();

router.get("/", getAllOrdersController);    

export default router;