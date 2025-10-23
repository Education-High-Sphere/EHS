import supabase from "../../../.config/db.js";

export default {
    async findByProfessorId(professorId ) {
    const { data, error } = await supabase
      .from("certificacoes_professor")
      .select("*")
      .eq("professor_id", professorId);
    if (error) {
      console.error("Erro ao buscar certificação:", error);
      return null;
    }
    return data;
  },
}