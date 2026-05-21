import cursoContentService from "../../services/cursos/cursoContentService.js";
import lessionsService from "../../services/cursos/lessionsService.js";
import cursoService from "../../services/cursos/cursoService.js";
import supabase from "../../../.config/db.js";

export default {
  // Módulos
  async createModule(req, res) {
    try {
      const { courseId } = req.params;
      const { titulo, ordem } = req.body;
      const newModule = await cursoContentService.createContent({
        curso_id: courseId,
        titulo,
        ordem: ordem || 0
      });
      res.status(201).json(newModule);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async updateModule(req, res) {
    try {
      const { contentId } = req.params;
      const updatedModule = await cursoContentService.updateContent(contentId, req.body);
      res.json(updatedModule);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteModule(req, res) {
    try {
      const { contentId } = req.params;
      await cursoContentService.deleteContent(contentId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  // Aulas
  async createLesson(req, res) {
    try {
      const { contentId } = req.params;
      const { titulo, descricao, video_url, ordem, duracao_minutos } = req.body;
      const file = req.file;

      let finalVideoUrl = video_url;

      // Se houve upload de arquivo de vídeo
      if (file) {
        const extension = file.originalname.split('.').pop();

        const fileName = `${Date.now()}.${extension}`;


        const filePath = `videos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          console.error("Erro no upload para Supabase (create):", uploadError);
          throw new Error("Erro ao fazer upload do vídeo: " + uploadError.message);
        }

        const { data: urlData } = await supabase.storage
          .from("assets")
          .getPublicUrl(filePath);

        finalVideoUrl = urlData.publicUrl;
      }

      // Detectar o tipo do recurso
      let tipo = "video";
      const recursoUrl = finalVideoUrl || "";
      
      if (file) {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (ext === 'pdf') tipo = 'pdf';
        else if (['ppt', 'pptx'].includes(ext)) tipo = 'slide';
      } else if (recursoUrl.includes('docs.google.com/presentation') || recursoUrl.includes('slideshare')) {
        tipo = 'slide';
      } else if (recursoUrl.endsWith('.pdf')) {
        tipo = 'pdf';
      }

      const newLesson = await lessionsService.createLession({
        conteudo_id: Number(contentId),
        titulo,
        url_recurso: recursoUrl,
        tipo,
        ordem: Number(ordem) || 0,
        duracao_minutos: Number(duracao_minutos) || 0
      });

      res.status(201).json(newLesson);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async updateLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const { titulo, descricao, video_url, ordem, duracao_minutos } = req.body;
      const file = req.file;

      let finalVideoUrl = video_url;

      if (file) {
        const extension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${extension}`;

        const filePath = `videos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          console.error("Erro no upload para Supabase (update):", uploadError);
          throw new Error("Erro ao fazer upload do vídeo: " + uploadError.message);
        }

        const { data: urlData } = await supabase.storage
          .from("assets")
          .getPublicUrl(filePath);

        finalVideoUrl = urlData.publicUrl;
      }

      // Detectar o tipo do recurso
      let tipo = "video";
      const recursoUrl = finalVideoUrl || "";
      
      if (file) {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (ext === 'pdf') tipo = 'pdf';
        else if (['ppt', 'pptx'].includes(ext)) tipo = 'slide';
      } else if (recursoUrl.includes('docs.google.com/presentation') || recursoUrl.includes('slideshare')) {
        tipo = 'slide';
      } else if (recursoUrl.endsWith('.pdf')) {
        tipo = 'pdf';
      }

      const updatedLesson = await lessionsService.updateLession(lessonId, {
        titulo,
        url_recurso: recursoUrl,
        tipo,
        ordem: Number(ordem) || 0,
        duracao_minutos: Number(duracao_minutos) || 0
      });

      res.json(updatedLesson);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteLesson(req, res) {
    try {
      const { lessonId } = req.params;
      await lessionsService.deleteLession(lessonId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
};
