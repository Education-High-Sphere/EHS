import avaliacaoRepository from "../../repositories/cursos/avaliacaoRepository.js";
import cursoRepository from "../../repositories/cursos/cursoRepository.js";

export default {
  async createReview(userId, courseId, nota, comentario) {
    if (!nota || nota < 1 || nota > 5) {
      throw new Error("A nota deve ser entre 1 e 5.");
    }

    const review = await avaliacaoRepository.create({
      user_id: userId,
      curso_id: courseId,
      nota,
      comentario
    });

    // Atualiza a média no curso para performance (desnormalização)
    const average = await avaliacaoRepository.getAverageRating(courseId);
    await cursoRepository.update(courseId, { avaliacao_media: average });

    return review;
  },

  async getReviewsByCourse(courseId) {
    return await avaliacaoRepository.findByCourseId(courseId);
  },

  async getUserRating(userId, courseId) {
    // Retorna se o usuário já avaliou este curso
    return await avaliacaoRepository.hasUserRated(userId, courseId);
  }
};
