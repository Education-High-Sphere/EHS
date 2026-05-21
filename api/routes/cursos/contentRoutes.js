import express from "express";
import contentController from "../../controllers/cursos/contentController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/multer.js";

const router = express.Router();

// Todas as rotas aqui requerem autenticação
router.use(authenticateToken);

// Rotas para Módulos
router.post("/:courseId/modules", contentController.createModule);
router.put("/modules/:contentId", contentController.updateModule);
router.delete("/modules/:contentId", contentController.deleteModule);

// Rotas para Aulas
router.post("/modules/:contentId/lessons", upload.single("video"), contentController.createLesson);
router.put("/lessons/:lessonId", upload.single("video"), contentController.updateLesson);
router.delete("/lessons/:lessonId", contentController.deleteLesson);

export default router;
