import express from "express";
import certificateController from "../controllers/certificateController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:matriculaId", authenticateToken, certificateController.downloadCertificate);

export default router;
