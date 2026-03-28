import { pool } from '../../../.config/db.js';

export default {
    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM usuarios_cursos WHERE id = $1', [id]);
        return rows[0] || null;
    },

    async findAll() {
        const { rows } = await pool.query('SELECT * FROM usuarios_cursos');
        return rows;
    },

    async findByUser(userId) {
        const { rows } = await pool.query('SELECT * FROM usuarios_cursos WHERE user_id = $1', [userId]);
        return rows;
    },

    async findByCourse(courseId) {
        const { rows } = await pool.query('SELECT * FROM usuarios_cursos WHERE curso_id = $1', [courseId]);
        return rows;
    },

    async findByUserAndCourse(userId, courseId) {
        const { rows } = await pool.query('SELECT * FROM usuarios_cursos WHERE user_id = $1 AND curso_id = $2', [userId, courseId]);
        return rows[0] || null;
    },

    async createMatricula(matriculaData) {
        const { user_id, curso_id, data_inicio } = matriculaData;
        const { rows } = await pool.query(
            'INSERT INTO usuarios_cursos (user_id, curso_id, data_inicio) VALUES ($1, $2, $3) RETURNING *',
            [user_id, curso_id, data_inicio]
        );
        return rows[0];
    },

    async updateMatricula(id, data) {
        const fields = Object.keys(data);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = Object.values(data);
        
        const query = `UPDATE usuarios_cursos SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const { rows } = await pool.query(query, [...values, id]);
        
        return rows[0] || null;
    },

    async deleteMatricula(id) {
        const { rowCount } = await pool.query('DELETE FROM usuarios_cursos WHERE id = $1', [id]);
        return rowCount > 0;
    }
};
