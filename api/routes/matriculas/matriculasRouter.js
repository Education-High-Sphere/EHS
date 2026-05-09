import express from "express";
import matriculasController from "../../controllers/matriculas/matriculasController.js";
import matriculasService from "../../services/matriculas/matriculasService.js";
import cursoRepository from "../../repositories/cursos/cursoRepository.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, matriculasController.createMatricula); // Rota para criar uma nova matrícula
router.get("/", authenticateToken, matriculasController.getAllMatriculas); // Rota para obter todas as matrículas
router.get("/:matriculaId", authenticateToken, matriculasController.getMatriculaById); // Rota para obter uma matrícula por ID
router.get("/user/:userId", authenticateToken, matriculasController.getMatriculasByUser); // Rota para obter matrículas por usuário
router.get("/course/:courseId", authenticateToken, matriculasController.getMatriculasByCourse); // Rota para obter matrículas por curso
router.patch("/:matriculaId", authenticateToken, matriculasController.updateMatricula); // Rota para atualizar uma matrícula
router.delete("/:matriculaId", authenticateToken, matriculasController.deleteMatricula); // Rota para deletar uma matrícula

router.get("/user/:userId/courses", async (req, res) => {
  try {
    const userId = req.params.userId;
    const matriculas = await matriculasService.getMatriculasByUser(userId);

    if (!matriculas || matriculas.length === 0) {
      return res.status(404).json({ error: "Matrículas não encontradas" });
    }

    const cursosIds = matriculas.map((m) => m.curso_id);
    const cursos = await cursoRepository.findByIds(cursosIds);

    if (!cursos || cursos.length === 0) {
      return res.status(404).json({ error: "Cursos não encontrados" });
    }

    const cursosConcluidos = cursos
      .filter((c) => matriculas.some((m) => m.curso_id === c.id && m.concluido))
      .map((c) => ({
        ...c,
        matricula: matriculas.find((m) => m.curso_id === c.id && m.concluido),
      }));

    const cursosEmAndamento = cursos
      .filter((c) =>
        matriculas.some((m) => m.curso_id === c.id && !m.concluido)
      )
      .map((c) => ({
        ...c,
        matricula: matriculas.find((m) => m.curso_id === c.id && !m.concluido),
      }));

    res.json({ cursosConcluidos, cursosEmAndamento});
  } catch (error) {
    console.error(
      "Erro ao obter matrículas por usuário e curso:",
      error.message
    );
    return res
      .status(500)
      .json({ error: "Erro ao obter matrículas por usuário e curso" });
  }
}); // Rota para obter matrícula por usuário e curso

export default router;
