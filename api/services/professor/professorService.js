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
}