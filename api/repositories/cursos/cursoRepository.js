import { pool } from "../../../.config/db.js";

export default {
  async findAll() {
    const { rows } = await pool.query("SELECT * FROM cursos");
    return rows;
  },

  async search(searchTerm) {
    const { rows } = await pool.query(
      "SELECT * FROM cursos WHERE nome ILIKE $1 OR descricao ILIKE $1",
      [`%${searchTerm}%`]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM cursos WHERE id = $1", [id]);
    return rows[0] || null;
  },

  async findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const { rows } = await pool.query("SELECT * FROM cursos WHERE id = ANY($1)", [ids]);
    return rows;
  },

  async findByCategoria(categoria) {
    const { rows } = await pool.query("SELECT * FROM cursos WHERE categoria ILIKE $1", [categoria]);
    return rows;
  },

  async findByProfessorId(professorId) {
    const { rows } = await pool.query("SELECT * FROM cursos WHERE professor_id = $1", [professorId]);
    return rows;
  },

  async create(courseData) {
    const {
      nome,
      descricao,
      imagem,
      categoria,
      preco,
      duracao,
      nivel,
      publicated,
      professor_id,
      alunos,
      avaliacao_media,
    } = courseData;

    const query = `
      INSERT INTO cursos (
        nome, descricao, imagem, categoria, preco, duracao, nivel, 
        publicated, professor_id, alunos, avaliacao_media
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *
    `;
    
    const values = [
      nome, descricao, imagem, categoria, preco, duracao, nivel, 
      publicated, professor_id, alunos, avaliacao_media
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, courseData) {
    // Note: This logic assumes courseData has all fields or is already merged.
    // To keep it simple and consistent with previous behavior:
    const fields = Object.keys(courseData);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = Object.values(courseData);
    
    const query = `UPDATE cursos SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    const { rows } = await pool.query(query, [...values, id]);
    
    return rows[0] || null;
  },

  async delete(id) {
    // Supabase storage logic removed as per user instruction "dont use url"
    const { rowCount } = await pool.query("DELETE FROM cursos WHERE id = $1", [id]);
    return rowCount > 0;
  },
};
