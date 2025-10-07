import supabase from '../../../.config/db.js'; // importa o pool do db.js

export default {
    async findById(id) {
        const{ data, error } = await supabase
            .from('usuarios_cursos')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Erro ao buscar matricula:', error);
            return null;
        }
        return data;
    },

    async findAll() {
        const { data, error } = await supabase.from('usuarios_cursos').select('*');
        if (error) {
            console.error('Erro ao buscar matriculas:', error);
            return [];
        }
        return data;
    },

    async findByUser(userId) {
        const { data, error } = await supabase
            .from('usuarios_cursos')
            .select('*')
            .eq('user_id', userId);
        if (error) {
            console.error('Erro ao buscar matriculas:', error);
            return [];
        }
        return data;
    },

    async findByCourse(courseId) {
        const { data, error } = await supabase
            .from('usuarios_cursos')
            .select('*')
            .eq('curso_id', courseId);
        if (error) {
            console.error('Erro ao buscar matriculas:', error);
            return [];
        }
        return data;
    },

    async findByUserAndCourse(userId, courseId) {
        const { data, error } = await supabase
            .from('usuarios_cursos')
            .select('*')
            .eq('user_id', userId)
            .eq('curso_id', courseId)
            .single();
        if (error) {
            console.error('Erro ao buscar matricula:', error);
            return null;
        }
        return data;
    },

    async createMatricula(matriculaData) {
        const { user_id, curso_id, data_inicio } = matriculaData;
        const { data, error } = await supabase
            .from('usuarios_cursos')
            .insert([{ user_id, curso_id, data_inicio }])
            .select()
            .single();
        if (error) {
            console.error('Erro ao criar matricula:', error);
            return null;
        }
        return this.findById(data.id); // retorna a matrícula completa
    },

    async updateMatricula(id, data) {
        const { data: updatedData, error } = await supabase
            .from('usuarios_cursos')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Erro ao atualizar matricula:', error);
            return null;
        }
        return this.findById(updatedData.id); // retorna a matrícula completa
},

    async deleteMatricula(id) {
        const { error } = await supabase
            .from('usuarios_cursos')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Erro ao deletar matricula:', error);
            return false;
        }
        return true;
    }
};
