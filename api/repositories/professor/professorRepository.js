import { pool } from "../../../.config/db.js";

export default {
    async findById(userId) {
        const { rows } = await pool.query('SELECT * FROM professores WHERE user_id = $1', [userId]);
        return rows[0] || null;
    },
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM professores');
        return rows;
    },
    async create(professor) {
        const fields = Object.keys(professor);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(professor);
        const query = `INSERT INTO professores (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async update(userId, updates) {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE professores SET ${setClause} WHERE user_id = $${fields.length + 1} RETURNING *`;
        const { rows } = await pool.query(query, [...values, userId]);
        return rows[0] || null;
    }
};