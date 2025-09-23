import cursoRepository from "../../repositories/cursos/cursoRepository.js";

export default {
    async getAllCourses() {
        try {
            const courses = await cursoRepository.findAll();
            return courses;
        } catch (error) {
            throw new Error("Erro ao buscar cursos: " + error.message);
        }
    },
    async searchCourses(searchTerm) {
        try {
            const courses = await cursoRepository.search(searchTerm);
            return courses;
        } catch (error) {
            throw new Error("Erro ao buscar cursos: " + error.message);
        }
    },

    async getCourseById(id) {
        try {
            const course = await cursoRepository.findById(id);
            if (!course) {
                throw new Error("Curso não encontrado");
            }
            return course;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getCoursesByCategoria(categoria) {
        try {
            const courses = await cursoRepository.findByCategoria(categoria);
            return courses;
        } catch (error) {
            throw new Error("Erro ao buscar cursos: " + error.message);
        }
    },

    async createCourse(courseData) {
        try {
            if (!courseData.nome || !courseData.descricao) {
                throw new Error("Nome e descrição são obrigatórios");
            }
            const newCourse = await cursoRepository.create(courseData);
            return newCourse;
        } catch (error) {
            throw new Error("Erro ao criar curso: " + error.message);
        }
    },

    async updateCourse(id, courseData) {
        try {
            const existingCourse = await cursoRepository.findById(id);
            if (!existingCourse) {
                throw new Error("Curso não encontrado");
            }
            const updatedCourse = await cursoRepository.update(id, courseData);
            return updatedCourse;
        } catch (error) {
            throw new Error("Erro ao atualizar curso: " + error.message);
        }
    },

    async deleteCourse(id) {
        try {
            const existingCourse = await cursoRepository.findById(id);
            if (!existingCourse) {
                throw new Error("Curso não encontrado");
            }
            await cursoRepository.delete(id);
        } catch (error) {
            throw new Error("Erro ao deletar curso: " + error.message);
        }
    }
};
