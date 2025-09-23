import express from "express";
import courseController from "../../controllers/cursos/cursoController.js";

const router = express.Router();

// Rotas para cursos
      // Listar todos
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);   // Listar por ID
router.get("/category/:categoria", courseController.getCoursesByCategoria); // Listar por categoria
router.post("/", courseController.createCourse);       // Criar novo
router.put("/:id", courseController.updateCourse);     // Atualizar
router.delete("/:id", courseController.deleteCourse);  // Deletar
 // Renderizar página de cursos

export default router;
