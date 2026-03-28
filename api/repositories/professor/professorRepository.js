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
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from("professores")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Erro ao buscar professor:", error);
      return null;
    }
    return data;
  },
}