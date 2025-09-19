import db from "../../../.config/db.js"; // conexão MySQL centralizada

export default {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM cursos");
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM cursos WHERE id = ?", [id]);
        return rows[0]; // retorna só um
    },
    async findByIds(ids) {
        if (ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const [rows] = await db.query(`SELECT * FROM cursos WHERE id IN (${placeholders})`, ids);
        return rows; // retorna todos os encontrados
    },
    async findByCategoria(categoria) {
        const [rows] = await db.query("SELECT * FROM cursos WHERE categoria = ?", [categoria]);
        return rows; // retorna todos da categoria
    },

    async create(courseData) {
        const { nome, descricao, imagem, categoria, preco, duracao, nivel } = courseData;

        const [result] = await db.query(
            `INSERT INTO cursos (nome, descricao, imagem, categoria, preco, duracao, nivel) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome, descricao, imagem, categoria, preco, duracao, nivel]
        );

        return { id: result.insertId, ...courseData };
    },

    async update(id, courseData) {
        const { nome, descricao, imagem, categoria, preco, duracao, nivel } = courseData;

        await db.query(
            `UPDATE cursos 
             SET nome = ?, descricao = ?, imagem = ?, categoria = ?, preco = ?, duracao = ?, nivel = ?
             WHERE id = ?`,
            [nome, descricao, imagem, categoria, preco, duracao, nivel, id]
        );

        return { id, ...courseData };
    },

    async delete(id) {
        await db.query("DELETE FROM cursos WHERE id = ?", [id]);
    }
};
