import { pool } from "../../../.config/db.js";

export default {
    async findByProfessorId(professorId) {
        const { rows } = await pool.query('SELECT * FROM certificacoes_professor WHERE professor_id = $1', [professorId]);
        return rows;
    },
    async create(certificacao) {
        const fields = Object.keys(certificacao);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(certificacao);
        const query = `INSERT INTO certificacoes_professor (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM certificacoes_professor WHERE id = $1', [id]);
        return rowCount > 0;
    }
};