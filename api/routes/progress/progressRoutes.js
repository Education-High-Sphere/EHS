import express from "express";
import progressController from "../../controllers/progress/progressController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/complete", authenticateToken, progressController.completeLesson);
router.get("/:courseId", authenticateToken, progressController.getProgress);

export default router;
