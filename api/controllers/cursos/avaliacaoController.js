import avaliacaoService from "../../services/cursos/avaliacaoService.js";

export default {
  async addReview(req, res) {
    try {
      const { courseId } = req.params;
      const { nota, comentario } = req.body;
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const userId = req.user.id;

      const review = await avaliacaoService.createReview(userId, courseId, nota, comentario);
      res.status(201).json(review);
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
      res.status(500).json({ message: error.message || "Erro ao adicionar avaliação." });
    }
  },

  async getReviews(req, res) {
    try {
      const { courseId } = req.params;
      const reviews = await avaliacaoService.getReviewsByCourse(courseId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar avaliações." });
    }
  }
};
