import supabase from "../../../.config/db.js";

export default {
    async findById(id) {
    const { data, error } = await supabase
      .from("professores")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Erro ao buscar professor:", error);
      return null;
    }
    return data;
  },
}