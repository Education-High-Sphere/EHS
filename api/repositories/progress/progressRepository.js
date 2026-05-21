import { pool } from "../../../.config/db.js";

const ProgressRepository = {
  async markLessonAsComplete(userId, lessonId) {
    const query = `
      INSERT INTO aulas_concluidas (user_id, aula_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, aula_id) DO NOTHING
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, lessonId]);
    return rows[0];
  },

  async getCompletedLessons(userId, courseId) {
    const query = `
      SELECT ac.aula_id 
      FROM aulas_concluidas ac
      JOIN aulas a ON ac.aula_id = a.id
      JOIN conteudos_curso cc ON a.conteudo_id = cc.id
      WHERE ac.user_id = $1 AND cc.curso_id = $2
    `;
    const { rows } = await pool.query(query, [userId, courseId]);
    return rows.map(r => r.aula_id);
  },

  async countTotalLessons(courseId) {
    const query = `
      SELECT COUNT(a.id) 
      FROM aulas a
      JOIN conteudos_curso cc ON a.conteudo_id = cc.id
      WHERE cc.curso_id = $1
    `;
    const { rows } = await pool.query(query, [courseId]);
    return parseInt(rows[0].count);
  },

  async updateCourseProgress(userId, courseId, progress, concluido = false) {
    const query = `
      UPDATE usuarios_cursos 
      SET progresso = $1, concluido = $2
      WHERE user_id = $3 AND curso_id = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [progress, concluido, userId, courseId]);
    return rows[0];
  }
};

export default ProgressRepository;
