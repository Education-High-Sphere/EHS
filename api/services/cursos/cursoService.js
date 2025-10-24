import cursoRepository from "../../repositories/cursos/cursoRepository.js";
import supabase from "../../../.config/db.js";

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
  async getCoursesByProfessorId(professorId) {
    try {
      const courses = await cursoRepository.findByProfessorId(professorId);
      return courses;
    } catch (error) {
      throw new Error("Erro ao buscar cursos: " + error.message);
    }
  },

  async createCourse(courseData,file,professorId) {
    try {
      if (!courseData.nome || !courseData.descricao) {
        throw new Error("Nome e descrição são obrigatórios");
      }
      if (!file) {
        throw new Error("Imagem obrigatória");
      }
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = `cursos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });
        console.log("Imagem uploadada com sucesso:", uploadData);

      if (uploadError) {
        throw new Error(
          "Erro ao fazer upload da imagem: " + uploadError.message
        );
      }

      const { data: urlData } = await supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      const finalCourseData = {
        nome: courseData.nome,
        descricao: courseData.descricao,
        categoria: courseData.categoria,
        preco: parseFloat(courseData.preco),
        duracao: courseData.duracao,
        nivel: courseData.nivel,
        publicated: courseData.publicated === "true", // Converte string para booleano
        imagem: imageUrl, // A URL correta!
        professor_id: professorId, // O ID do professor logado
        alunos: 0, // Valor inicial
        avaliacao_media: 0, // Valor inicial
      };

      const newCourse = await cursoRepository.create(finalCourseData);
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
  },
};
