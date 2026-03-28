import lessionsRepository from "../../repositories/cursos/lessionsRepository.js";
import cursoContentRepository from "../../repositories/cursos/cursoContentRepository.js";

export default {
    async getLessionsByContentId(contentId) {
        try {
            const lessions = await lessionsRepository.findLessionsByContentId(contentId);
            return lessions;
        } catch (error) {
            throw new Error("Erro ao buscar lições do conteudo: " + error.message);
        }
    },
    async getLessionsByIds(ids) {
        try {
            const lessions = await lessionsRepository.findLessionsByIds(ids);
            return lessions;
        } catch (error) {
            throw new Error("Erro ao buscar lições: " + error.message);
        }
    },
    async getLessionById(id) {
        try {
            const lession = await lessionsRepository.findLessionById(id);
            return lession;
        } catch (error) {
            throw new Error("Erro ao buscar lição: " + error.message);
        }
    },
    async createLession(lesson) {
        try {
            if (!lesson.titulo || !lesson.conteudo_id) {
                throw new Error("Título e conteudo_id são obrigatórios");
            }
            const newLession = await lessionsRepository.create(lesson);
            return newLession;
        } catch (error) {
            throw new Error("Erro ao criar lição: " + error.message);
        }
    },
    async updateLession(id, updates) {
        try {
            const existingLession = await lessionsRepository.findLessionById(id);
            if (!existingLession) {
                throw new Error("Lição não encontrada");
            }
            const updatedLession = await lessionsRepository.update(id, updates);
            return updatedLession;
        } catch (error) {
            throw new Error("Erro ao atualizar lição: " + error.message);
        }
    },
    async deleteLession(id) {
        try {
            const existingLession = await lessionsRepository.findLessionById(id);
            if (!existingLession) {
                throw new Error("Lição não encontrada");
            }
            await lessionsRepository.delete(id);
        } catch (error) {
            throw new Error("Erro ao deletar lição: " + error.message);
        }
    }
    }