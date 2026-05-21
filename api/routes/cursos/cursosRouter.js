import express from "express";
import courseController from "../../controllers/cursos/cursoController.js";
import avaliacaoController from "../../controllers/cursos/avaliacaoController.js";
import multer from "multer";
import {checkUserMiddleware, authenticateToken} from '../../middlewares/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Rotas para cursos
router.get("/category/:categoria", courseController.getCoursesByCategoria); // Listar por categoria
      // Listar todos
router.get("/:id", courseController.getCourseById);   // Listar por ID
router.get("/", courseController.getAllCourses);


router.post("/create",checkUserMiddleware, upload.single('imagem'),  courseController.createCourse);  // Criar  
router.put('/:id/publish',checkUserMiddleware, courseController.togglePublish);  // Publicar ou despublicar
router.put("/:id",checkUserMiddleware, upload.single('imagem'),  courseController.updateCourse); // Atualizar
router.delete("/:id",checkUserMiddleware, courseController.deleteCourse);  // Deletar

// Avaliações
router.get("/:courseId/reviews", avaliacaoController.getReviews);
router.post("/:courseId/reviews", authenticateToken, avaliacaoController.addReview);

export default router;
