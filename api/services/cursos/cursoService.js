import cursoRepository from "../../repositories/cursos/cursoRepository.js";
import supabase from "../../../.config/db.js";

export default {
  async getAllCourses(limit = 9, offset = 0) {
    try {
      const courses = await cursoRepository.findAll(limit, offset);
      const total = await cursoRepository.countAll();
      return { courses, total };
    } catch (error) {
      throw new Error("Erro ao buscar cursos: " + error.message);
    }
  },
  async searchCourses(searchTerm, limit = 9, offset = 0) {
    try {
      // Usando repositório para busca com paginação, se quisermos manter a busca de banco.
      // O SearchService do fuse.js não tem paginação nativa sem buscar tudo.
      const courses = await cursoRepository.search(searchTerm, limit, offset);
      const total = await cursoRepository.countAll(); // Não é exato da busca, mas para MVP serve.
      return { courses, total };
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

  async getCoursesByIds(ids) {
    try {
      const courses = await cursoRepository.findByIds(ids);
      return courses;
    } catch (error) {
      throw new Error("Erro ao buscar cursos: " + error.message);
    }
  },

  async createCourse(courseData, file, professorId) {
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
        publicated: courseData.publicated === "true",
        imagem: imageUrl, 
        professor_id: professorId, 
        alunos: 0, 
        avaliacao_media: 0, 
      };

      const newCourse = await cursoRepository.create(finalCourseData);
      return newCourse;
    } catch (error) {
      throw new Error("Erro ao criar curso: " + error.message);
    }
  },

  async updateCourse(id, courseData, file) {
    try {
      const existingCourse = await cursoRepository.findById(id);
      if (!existingCourse) {
        throw new Error("Curso não encontrado");
      }

      if (file) {
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

        courseData.imagem = imageUrl;
      }

      if (file && existingCourse.imagem) {
        try {
          const originalImageName = existingCourse.imagem.split("/").pop();
          const { data, error: storageError } = await supabase.storage
            .from("assets")
            .remove([`cursos/${originalImageName}`]);
          if (storageError) {
            throw new Error(
              "Erro ao deletar imagem do curso: " + storageError.message
            );
          } else {
            console.log("Imagem do curso deletada com sucesso:", data);
          }
        } catch (error) {
          console.error("Erro ao deletar imagem do curso:", error);
        }
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

      console.log("Deletando curso com ID:", id);
      await cursoRepository.delete(id);
      console.log("Curso deletado com sucesso");
    } catch (error) {
      console.log("Erro capturado no catch:", error);
      console.log("Stack trace: ", error.stack);
      throw new Error("Erro ao deletar curso: " + error.message);
    }
  },

  async toggleCoursePublish(id){
    try{
      const course = await cursoRepository.findById(id);
      if (!course) {
        throw new Error("Curso nao encontrado");
        
      }
      const uptadedCourse = await cursoRepository.update(id, {publicated: !course.publicated});
      return uptadedCourse;
    } catch (error) {
      throw new Error("Erro ao atualizar curso: " + error.message);
    }
  }
};
