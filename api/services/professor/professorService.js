import professorRepository from "../../repositories/professor/professorRepository.js";

export default {
   async getProfessorById(id) {
           try {
               const professor = await professorRepository.findById(id);
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
                throw new Error("Professor nao encontrado");
            }
            return professor;
        } catch (error) {
            throw new Error(error.message);
        }
    },
}