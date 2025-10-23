import certificacoesProfessorRepository from "../../repositories/professor/certificacoesProfessorRepository.js";

export default {
   async getcertificacoesProfessorById(professorId) {
           try {
               const findByProfessorId = await certificacoesProfessorRepository.findByProfessorId(professorId);
               if (!findByProfessorId) {
                   throw new Error("Certificação não encontrado");
               }
               return findByProfessorId;
           } catch (error) {
               throw new Error(error.message);
           }
       }, 
}