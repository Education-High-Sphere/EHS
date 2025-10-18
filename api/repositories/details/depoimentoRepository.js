import supabase from "../../../.config/db.js";

export default {
  async findAll() {
    const { data: todosDepoimentos, error } = await supabase
      .from("depoimentos")
      .select("*")
      .order("ordem", { ascending: true });
    if (error) {
      console.error("Erro ao buscar depoimentos:", error);
      return [];
    }
    
    // Embaralha os depoimentos e retorna 3 aleatórios
    const shuffled = [...todosDepoimentos]; 
    let currentIndex = shuffled.length;
    let randomIndex;


    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    return shuffled.slice(0, 3);
  },
  async findById(id) {
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Erro ao buscar depoimento:", error);
      return null;
    }
    return data;
  },
  async create(depoimento) {
    const { data, error } = await supabase
      .from("depoimentos")
      .insert([depoimento])
      .single();
    if (error) {
      console.error("Erro ao criar depoimento:", error);
      return null;
    }
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase
      .from("depoimentos")
      .update(updates)
      .eq("id", id)
      .single();
    if (error) {
      console.error("Erro ao atualizar depoimento:", error);
      return null;
    }
    return data;
  },
  async delete(id) {
    const { data, error } = await supabase
      .from("depoimentos")
      .delete()
      .eq("id", id)
      .single();
    if (error) {
      console.error("Erro ao deletar depoimento:", error);
      return null;
    }
    return data;
  },
};
