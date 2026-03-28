import { pool } from "../../../.config/db.js";

export default {
    async findLessionsByContentId(contentId) {
        const { rows } = await pool.query("SELECT * FROM aulas WHERE conteudo_id = $1", [contentId]);
        return rows;
    },
    async findLessionsByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const { rows } = await pool.query("SELECT * FROM aulas WHERE id = ANY($1)", [ids]);
        return rows;
    },
    async findLessionsById(id) {
        const { rows } = await pool.query("SELECT * FROM aulas WHERE id = $1", [id]);
        return rows[0] || null;
    },
    async create(lession) {
        const fields = Object.keys(lession);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(lession);
        
        const query = `INSERT INTO aulas (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async update(id, updates) {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = Object.values(updates);
        
        const query = `UPDATE aulas SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const { rows } = await pool.query(query, [...values, id]);
        return rows[0] || null;
    },
    async delete(id) {
        const { rows } = await pool.query("DELETE FROM aulas WHERE id = $1 RETURNING *", [id]);
        return rows[0] || null;
    }
};