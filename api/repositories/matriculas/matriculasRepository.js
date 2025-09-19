import pool from '../../../.config/db.js'; // importa o pool do db.js

export default {
    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM usuarios_cursos WHERE id = ?', [id]);
        return rows[0]; // retorna a matrícula ou undefined se não existir
    },

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM usuarios_cursos');
        return rows;
    },

    async findByUser(userId) {
        const [rows] = await pool.query('SELECT * FROM usuarios_cursos WHERE user_id = ?', [userId]);
        return rows;
    },

    async findByCourse(courseId) {
        const [rows] = await pool.query('SELECT * FROM usuarios_cursos WHERE curso_id = ?', [courseId]);
        return rows;
    },

    async findByUserAndCourse(userId, courseId) {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios_cursos WHERE user_id = ? AND curso_id = ?',
            [userId, courseId]
        );
        return rows[0];
    },

    async createMatricula(matriculaData) {
        const { userId,courseId} = matriculaData;
        const [result] = await pool.query(
            'INSERT INTO usuarios_cursos (user_id, curso_id, concluido, progresso, data_inicio, data_conclusao, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId,courseId, false, 0, new Date(), null, new Date()]
        );
        // retorna a matrícula completa
        return this.findById(result.insertId);
    },

    async updateMatricula(id, data) {
    // pega os dados atuais
    const matricula = await this.findById(id);
    if (!matricula) {
        throw new Error('Matrícula não encontrada');
    }

    // atualiza só os campos que podem mudar
    const { concluido, progresso, data_inicio, data_conclusao } = data;

    await pool.query(
        `UPDATE usuarios_cursos 
         SET concluido = ?, progresso = ?, data_inicio = ?, data_conclusao = ? 
         WHERE id = ?`,
        [
            concluido ?? matricula.concluido,
            progresso ?? matricula.progresso,
            data_inicio ?? matricula.data_inicio,
            data_conclusao ?? matricula.data_conclusao,
            id
        ]
    );

    return this.findById(id); // retorna a matrícula atualizada
},

    async deleteMatricula(id) {
        await pool.query('DELETE FROM usuarios_cursos WHERE id = ?', [id]);
        return true;
    }
};
