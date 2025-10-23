import supabase from "../../../.config/db.js";

export default {
    async findByProfessorId(professorId) {
    const { data, error } = await supabase
      .from("experiencias_profissionais")
      .select("*")
      .eq("professor_id", professorId)
    if (error) {
      console.error("Erro ao buscar experiência:", error);
      return null;
    }
    return data;
  },
}