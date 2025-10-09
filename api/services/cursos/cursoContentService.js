import cursoContentRepository from "../../repositories/cursos/cursoContentRepository.js";

export default {
    async getContentByCourseId(courseId) {
        try {
            const content = await cursoContentRepository.findContentByCourseId(courseId);
            return content;
        } catch (error) {
            throw new Error("Erro ao buscar conteudo do curso: " + error.message);
        }
    },
    async getContentById(id) {
        try {
            const content = await cursoContentRepository.findContentById(id);
            return content;
        } catch (error) {
            throw new Error("Erro ao buscar conteudo do curso: " + error.message);
        }
    },
    async getContentByIds(ids) {
        try {
            const content = await cursoContentRepository.findContentByIds(ids);
            return content;
        } catch (error) {
            throw new Error("Erro ao buscar conteudo do curso: " + error.message);
        }
    },
    async createContent(content) {
        try {
            if (!content.titulo || !content.descricao || !content.curso_id) {
                throw new Error("Título, descrição e curso_id são obrigatórios");
            }
            const newContent = await cursoContentRepository.create(content);
    }
        catch (error) {
            throw new Error("Erro ao criar conteudo do curso: " + error.message);
        }
    },
    async updateContent(id, updates) {
        try {
            const existingContent = await cursoContentRepository.findContentById(id);
            if (!existingContent) {
                throw new Error("Conteudo do curso não encontrado");
            }
            const updatedContent = await cursoContentRepository.update(id, updates);
            return updatedContent;
        } catch (error) {
            throw new Error("Erro ao atualizar conteudo do curso: " + error.message);
        }
    },
    async deleteContent(id) {
        try {
            const existingContent = await cursoContentRepository.findContentById(id);
            if (!existingContent) {
                throw new Error("Conteudo do curso não encontrado");
            }
            await cursoContentRepository.delete(id);
        } catch (error) {
            throw new Error("Erro ao deletar conteudo do curso: " + error.message);
        }
    }
};