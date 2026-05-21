import { pool } from "../../../.config/db.js";

export default {
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM depoimentos');
        return rows;
    },
    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM depoimentos WHERE id = $1', [id]);
        return rows[0] || null;
    },
    async create(depoimento) {
        const fields = Object.keys(depoimento);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(depoimento);
        const query = `INSERT INTO depoimentos (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async update(id, updates) {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE depoimentos SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const { rows } = await pool.query(query, [...values, id]);
        return rows[0] || null;
    },
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM depoimentos WHERE id = $1', [id]);
        return rowCount > 0;
    }
};
