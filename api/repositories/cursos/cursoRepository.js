import supabase from "../../../.config/db.js"; // conexão MySQL centralizada

export default {
  async findAll() {
    const { data, error } = await supabase.from("cursos").select("*");
    if (error) {
      console.error("Erro ao buscar cursos:", error);
      return [];
    }
    return data;
  },

  async search(searchTerm) {
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .or(`nome.ilike.%${searchTerm}%, descricao.ilike.%${searchTerm}%`);
    if (error) {
      console.error("Erro ao buscar cursos:", error);
      return [];
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Erro ao buscar curso:", error);
      return null;
    }
    return data;
  },
  async findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .in("id", ids);
    if (error) {
      console.error("Erro ao buscar cursos:", error);
      return [];
    }
    return data;
  },
  async findByCategoria(categoria) {
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .ilike("categoria", categoria);
    if (error) {
      console.error("Erro ao buscar cursos:", error);
      return [];
    }
    return data;
  },
  async findByProfessorId(professorId) {
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("professor_id", professorId);
    if (error) {
      console.error("Erro ao buscar cursos:", error);
      return [];
    }
    return data;
  },

  async create(courseData) {
    const {
      nome,
      descricao,
      imagem,
      categoria,
      preco,
      duracao,
      nivel,
      publicated,
      professor_id,
      alunos,
      avaliacao_media,
    } = courseData;

    const { data: insertData, error: insertError } = await supabase
      .from("cursos")
      .insert([
        {
          nome,
          descricao,
          imagem,
          categoria,
          preco,
          duracao,
          nivel,
          publicated,
          professor_id,
          alunos,
          avaliacao_media,
        },
      ])
      .select("id") // Pega SÓ o ID de volta
      .single();

    if (insertError || !insertData) {
      console.error("Erro na etapa de INSERT:", insertError);
      throw new Error("Falha ao inserir o curso no banco.");
    }

    console.log("Curso inserido com ID:", insertData.id);
    const { data: selectData, error: selectError } = await supabase
      .from("cursos")
      .select("*") // Pega todos os dados
      .eq("id", insertData.id) // Do curso que acabamos de criar
      .single();

    if (selectError) {
      console.error("Erro na etapa de SELECT:", selectError);
      throw new Error("Falha ao buscar o curso após a criação.");
    }

    // Retorna o objeto completo do curso
    return selectData;
  },

  async update(id, courseData) {
    const { nome, descricao, imagem, categoria, preco, duracao, nivel } =
      courseData;

    const { data, error } = await supabase
      .from("cursos")
      .update({ nome, descricao, imagem, categoria, preco, duracao, nivel })
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao atualizar curso:", error);
      return null;
    }
    return data;
  },

  async delete(id) {
    const curso = await this.findById(id);

    if (curso && curso.imagem) {
      const imageName = curso.imagem.split("/").pop();

      const imagePath = `cursos/${imageName}`;

      const { data, error } = await supabase.storage
        .from("assets")
        .remove([imagePath]);
      if (error) {
        console.error("Erro ao deletar imagem do curso:", error);
      } else {
        console.log("Imagem do curso deletada com sucesso:", data);
      }
    }
    if (error) {
      console.error("Erro ao deletar curso:", error);
      return false;
    }
    return true;
  },
};
