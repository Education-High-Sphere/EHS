import progressRepository from "../../repositories/progress/progressRepository.js";
import lessionsService from "../cursos/lessionsService.js";
import { pool } from "../../../.config/db.js";

const ProgressService = {
  async completeLesson(userId, lessonId) {
    // Marcar como concluída
    await progressRepository.markLessonAsComplete(userId, lessonId);

    // Buscar curso desta aula para recalcular progresso
    const lesson = await lessionsService.getLessionById(lessonId);
    
    // Buscar o conteudo (módulo) para pegar o curso_id
    const { rows: contentRows } = await pool.query(
      "SELECT curso_id FROM conteudos_curso WHERE id = $1", 
      [lesson.conteudo_id]
    );
    
    if (contentRows.length === 0) {
      throw new Error("Módulo não encontrado para esta aula.");
    }
    
    const courseId = contentRows[0].curso_id;

    // Calcular novo progresso
    const totalLessons = await progressRepository.countTotalLessons(courseId);
    const completedLessons = await progressRepository.getCompletedLessons(userId, courseId);
    const completedLessonsCount = completedLessons.length;

    const progress = (completedLessonsCount / totalLessons) * 100;
    const isCompleted = progress >= 100;

    // Atualizar na tabela de matrículas
    await progressRepository.updateCourseProgress(userId, courseId, progress, isCompleted);

    return { progress, isCompleted };
  },

  async getCourseProgress(userId, courseId) {
    const completedLessons = await progressRepository.getCompletedLessons(userId, courseId);
    return completedLessons;
  }
};

export default ProgressService;
