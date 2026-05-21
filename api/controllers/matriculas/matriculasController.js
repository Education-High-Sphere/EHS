import matriculasService from '../../services/matriculas/matriculasService.js';

export default {
    async createMatricula(req, res) {
        try {
            const { courseId } = req.body;
            const userId = res.locals.user ? res.locals.user.id : null;

            if (!userId) {
                return res.status(401).json({ error: "Você precisa estar logado para se inscrever." });
            }

            const newMatricula = await matriculasService.createMatricula({ userId, courseId });
            res.status(201).json(newMatricula);
        } catch (error) {
            console.error("Erro ao criar matrícula:", error.message);
            res.status(400).json({ error: error.message });
        }
    },

    async getAllMatriculas(req, res) {
        try {
            const matriculas = await matriculasService.getAllMatriculas();
            res.json(matriculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getMatriculasByUser(req, res) {
        try {
            const userId = req.params.userId;
            const matriculas = await matriculasService.getMatriculasByUser(userId);
            res.json(matriculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    },

    async getMatriculasByCourse(req, res) {
        try {
            const courseId = req.params.courseId;
            const matriculas = await matriculasService.getMatriculasByCourse(courseId);
            res.json(matriculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getMatriculaById(req, res) {
        try {
            const matriculaId = req.params.matriculaId;
            const matricula = await matriculasService.getMatriculaById(matriculaId);
            res.json(matricula);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getMatriculaByUserandCourse(req, res) {
        try {
            const { userId, courseId } = req.params;
            const matricula = await matriculasService.getMatriculaByUserandCourse(userId, courseId);
            res.json(matricula);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateMatricula(req, res) {
        try {
            const matriculaId = req.params.matriculaId;
            const updateData = req.body;
            const updatedMatricula = await matriculasService.updateMatricula(matriculaId, updateData);
            res.json(updatedMatricula);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async deleteMatricula(req, res) {
        try {
            const matriculaId = req.params.matriculaId;
            await matriculasService.deleteMatricula(matriculaId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};


