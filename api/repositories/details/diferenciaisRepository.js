import supabase from "../../../.config/db.js";

export default {
    async findAll() {
        const { data, error } = await supabase
            .from("diferenciais")
            .select("*")
            .order("ordem", { ascending: true });
        if (error) {
            console.error("Erro ao buscar diferenciais:", error);
            return [];
        }
        return data;
    },
    async findById(id) {
        const { data, error } = await supabase
            .from("diferenciais")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao buscar diferencial:", error);
            return null;
        }
        return data;
    },
    async create(diferencial) {
        const { data, error } = await supabase
            .from("diferenciais")
            .insert([diferencial])
            .single();
        if (error) {
            console.error("Erro ao criar diferencial:", error);
            return null;
        }
        return data;
    },
    async update(id, updates) {
        const { data, error } = await supabase
            .from("diferenciais")
            .update(updates)
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao atualizar diferencial:", error);
            return null;
        }
        return data;
    },
    async delete(id) {
        const { data, error } = await supabase
            .from("diferenciais")
            .delete()
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao deletar diferencial:", error);
            return null;
        }
        return data;
    },
}