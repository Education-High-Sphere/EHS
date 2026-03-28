import { pool } from "../../../.config/db.js";

export default {
    async findByProfessorId(professorId) {
        const { rows } = await pool.query('SELECT * FROM experiencias_professor WHERE professor_id = $1', [professorId]);
        return rows;
    },
    async create(experiencia) {
        const fields = Object.keys(experiencia);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(experiencia);
        const query = `INSERT INTO experiencias_professor (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM experiencias_professor WHERE id = $1', [id]);
        return rowCount > 0;
    }
};