import supabase from "../../../.config/db.js";

export default {
    async findContentByCourseId(courseId) {
        const { data, error } = await supabase
            .from("conteudos_curso")
            .select("*")
            .eq("curso_id", courseId);
        if (error) {
            console.error("Erro ao buscar conteudo do curso:", error);
            return [];
        }
        return data;
    },
    async findContentByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const { data, error } = await supabase
            .from("conteudos_curso")
            .select("*")
            .in("id", ids);
        if (error) {
            console.error("Erro ao buscar conteudo do curso:", error);
            return [];
        }
        return data;
    },
    async findContentById(id) {
        const { data, error } = await supabase
            .from("conteudos_curso")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao buscar conteudo do curso:", error);
            return null;
        }
        return data;
    },
    async create(content) {
        const { data, error } = await supabase
            .from("conteudos_curso")
            .insert([content])
            .single();
        if (error) {
            console.error("Erro ao criar conteudo do curso:", error);
            return null;
        }
        return data;
    },
    async update(id, updates) {
        const { data, error } = await supabase
            .from("conteudos_curso")
            .update(updates)
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao atualizar conteudo do curso:", error);
            return null;
        }
        return data;
    },
    async delete(id) {
        const { data, error } = await supabase
            .from("conteudos_curso")
            .delete()
            .eq("id", id)
            .single();
        if (error) {
            console.error("Erro ao deletar conteudo do curso:", error);
            return null;
        }
        return data;
    }
};