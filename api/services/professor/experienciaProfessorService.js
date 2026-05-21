import experienciaProfessorRepository from "../../repositories/professor/experienciaProfessorRepository.js";
export default {
  async getexperienciaProfessorById(professorId) {
    try {
      const professor = await experienciaProfessorRepository.findByProfessorId(professorId);
      if (!professor) {
        throw new Error("Experiência não encontrado");
      }
      return professor;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async createExperiencia(data) {
    try {
      return await experienciaProfessorRepository.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};