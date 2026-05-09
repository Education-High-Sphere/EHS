import { pool } from "../../../.config/db.js";

export default {
  async create(reviewData) {
    const { user_id, curso_id, nota, comentario } = reviewData;
    const query = `
      INSERT INTO avaliacoes (user_id, curso_id, nota, comentario)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, curso_id) DO UPDATE 
      SET nota = EXCLUDED.nota, comentario = EXCLUDED.comentario, created_at = NOW()
      RETURNING *
    `;
    const values = [user_id, curso_id, nota, comentario];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByCourseId(courseId) {
    const query = `
      SELECT a.*, u.name as user_name, u.avatar as user_avatar
      FROM avaliacoes a
      JOIN users u ON a.user_id = u.id
      WHERE a.curso_id = $1
      ORDER BY a.created_at DESC
    `;
    const { rows } = await pool.query(query, [courseId]);
    return rows;
  },

  async getAverageRating(courseId) {
    const query = `
      SELECT AVG(nota) as average
      FROM avaliacoes
      WHERE curso_id = $1
    `;
    const { rows } = await pool.query(query, [courseId]);
    return parseFloat(rows[0].average) || 0;
  },

  async hasUserRated(userId, courseId) {
    const query = `
      SELECT id FROM avaliacoes
      WHERE user_id = $1 AND curso_id = $2
    `;
    const { rows } = await pool.query(query, [userId, courseId]);
    return rows.length > 0;
  }
};
