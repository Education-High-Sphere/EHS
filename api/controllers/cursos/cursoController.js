import cursoService from '../../services/cursos/cursoService.js';

export default {
    async getAllCourses(req, res) {
        try {
            const courses = await cursoService.getAllCourses();
            res.json(courses);
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
            const courses = await cursoService.getCoursesByCategoria(req.params.categoria);
            res.json(courses);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async createCourse(req, res) {
        try {
            const newCourse = await cursoService.createCourse(req.body);
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateCourse(req, res) {
        try {
            const updatedCourse = await cursoService.updateCourse(req.params.id, req.body);
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
    async renderCoursesPage(req, res) {
        try {
            const courses = await cursoService.getAllCourses();
            res.render('courses', { title: 'Cursos', courses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};