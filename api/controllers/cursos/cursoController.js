import cursoService from "../../services/cursos/cursoService.js";
import { searchCourses } from "../../services/searchService.js";
import professorService from "../../services/professor/professorService.js";

export default {
  async getAllCourses(req, res) {
    try {
      const result = await cursoService.getAllCourses();
      res.json(result.courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getCourseById(req, res) {
    try {
      const course = await cursoService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  async getCoursesByCategoria(req, res) {
    try {
      const courses = await cursoService.getCoursesByCategoria(
        req.params.categoria
      );
      res.json(courses);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  async createCourse(req, res) {
    try {
      const userId = res.locals.user.id;

      const professorInfo = await professorService.getProfessorByUserId(userId);
      const professorId = professorInfo.id;

      const file = req.file;
      const courseData = req.body;
      const newCourse = await cursoService.createCourse(
        courseData,
        file,
        professorId
      );
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async updateCourse(req, res) {
    try {
      const updatedCourse = await cursoService.updateCourse(
        req.params.id,
        req.body
      );
      res.json(updatedCourse);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  async deleteCourse(req, res) {
    try {
      await cursoService.deleteCourse(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  async listOrSearchCourses(searchQuery, page = 1) {
    let coursesData;
    let categoria = null;
    let total = 0;
    const limit = 9;
    const offset = (page - 1) * limit;

    if (!searchQuery || searchQuery.trim() === "") {
      const result = await cursoService.getAllCourses(limit, offset);
      coursesData = result.courses;
      total = result.total;
      categoria = "Todos os Cursos";
    } else {
      const searchResults = await searchCourses(searchQuery);
      // Paginando na memória para a busca via fuse.js
      total = searchResults.length;
      coursesData = searchResults.map((result) => result.item).slice(offset, offset + limit);
      categoria = searchResults.categoria || "Resultados da Busca";
    }

    const totalPages = Math.ceil(total / limit);

    return { coursesData, categoria, searchQuery: searchQuery || "", currentPage: parseInt(page), totalPages };
  },

  async togglePublish(req, res) {
    try {
      const {id} = req.params;
      const updatedCourse = await cursoService.toggleCoursePublish(id);
      res.json({
        success: true,
        message : `Curso ${updatedCourse.title} ${updatedCourse.publicated ? 'publicado' : 'despublicado'}`,
        course: updatedCourse
      });

    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
};
