import db from "../../../.config/db.js"; // conexão PostgreSQL centralizada

export default {
    async findAll() {
        const { rows } = await db.query("SELECT * FROM cursos");
        return rows;
    },

    async findById(id) {
        const { rows } = await db.query("SELECT * FROM cursos WHERE id = $1", [id]);
        return rows[0]; // retorna só um
    },
    async findByCategoria(categoria) {
        const { rows } = await db.query("SELECT * FROM cursos WHERE categoria = $1", [categoria]);
        return rows; // retorna todos da categoria
    },

    async create(courseData) {
        const { nome, descricao, imagem, categoria, preco, duracao, nivel } = courseData;

        const { rows } = await db.query(
            `INSERT INTO cursos (nome, descricao, imagem, categoria, preco, duracao, nivel) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [nome, descricao, imagem, categoria, preco, duracao, nivel]
        );

        return { id: rows[0].id, ...courseData };
    },

    async update(id, courseData) {
        const { nome, descricao, imagem, categoria, preco, duracao, nivel } = courseData;

        await db.query(
            `UPDATE cursos 
             SET nome = $1, descricao = $2, imagem = $3, categoria = $4, preco = $5, duracao = $6, nivel = $7
             WHERE id = $8`,
            [nome, descricao, imagem, categoria, preco, duracao, nivel, id]
        );

        return { id, ...courseData };
    },

    async delete(id) {
        await db.query("DELETE FROM cursos WHERE id = $1", [id]);
    }
};
