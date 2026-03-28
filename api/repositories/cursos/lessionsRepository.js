import supabase from "../../../.config/db.js";

export default {
    async findLessionsByContentId(contentId) {
        const { data, error } = await supabase
            .from("aulas")
            .select("*")
            .eq("conteudo_id", contentId);
        if (error) {
            console.error("Erro ao buscar lições do conteudo:", error);
            return [];
        }
        return data;
    },

    async findLessionsByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const { data, error } = await supabase
            .from("aulas")
            .select("*")
            .in("id", ids);
        if (error) {
            console.error("Erro ao buscar lições:", error);
            return [];
        }
        return data;
    },
    async findLessionById(id) {
        const { data, error } = await supabase
            .from("aulas")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao buscar lição:", error);
            return null;
        }
        return data;
    },
    async create(lesson) {
        const { data, error } = await supabase
            .from("aulas")
            .insert([lesson])
            .single();
        if (error) {
            console.error("Erro ao criar lição:", error);
            return null;
        }
        return data;
    },
    async update(id, updates) {
        const { data, error } = await supabase
            .from("aulas")
            .update(updates)
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao atualizar lição:", error);
            return null;
        }
        return data;
    },
    async delete(id) {
        const { data, error } = await supabase
            .from("aulas")
            .delete()
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao deletar lição:", error);
            return null;
        }
        return data;
    }
};