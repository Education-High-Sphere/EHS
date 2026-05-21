import professorRepository from "../../repositories/professor/professorRepository.js";

export default {
   async getProfessorById(id) {
        try {
            const professor = await professorRepository.findByProfessorId(id);
            if (!professor) {
                throw new Error("Professor não encontrado");
            }
            return professor;
        } catch (error) {
            throw new Error(error.message);
        }
    }, 

    async getProfessorByUserId(userId) {
        try {
            const professor = await professorRepository.findByUserId(userId);
            if (!professor) {
                throw new Error("Professor não encontrado");
            }
            return professor;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async createProfessor(data) {
        try {
            const existing = await professorRepository.findByUserId(data.user_id);
            if (existing) {
                throw new Error("Usuário já é professor");
            }
            const professor = await professorRepository.create(data);
            return professor;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};