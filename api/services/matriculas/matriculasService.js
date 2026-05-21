import matriculasRepository from '../../repositories/matriculas/matriculasRepository.js';

export default {
    async createMatricula(data) {
        if (!data.userId || !data.courseId) {
            throw new Error('userId e courseId são obrigatórios');
        }
        const existing = await matriculasRepository.findByUserAndCourse(data.userId, data.courseId);
        if (existing) {
            throw new Error('Matrícula já existe para este usuário e curso');
        }
        const matricula = await matriculasRepository.createMatricula(data);
        return matricula;
    },
    async getAllMatriculas() {
        return await matriculasRepository.findAll();
    },
    async getMatriculaById(matriculaId) {
        const matricula = await matriculasRepository.findById(matriculaId);
        if (!matricula) {
            throw new Error('Matrícula não encontrada');
        }
        return matricula;
    },
    async getMatriculasByUser(userId) {
        return await matriculasRepository.findByUser(userId);
    },
    async getMatriculasByCourse(courseId) {
        return await matriculasRepository.findByCourse(courseId);
    },

    async getMatriculasByUserAndCourse(userId, courseId) {
        return await matriculasRepository.findByUserAndCourse(userId, courseId);
    },
    async updateMatricula(matriculaId, data) {
        const existing = await matriculasRepository.findById(matriculaId);
        if (!existing) {
            throw new Error('Matrícula não encontrada');
        }
        await matriculasRepository.updateMatricula(matriculaId, data);
        const updatedMatricula = await matriculasRepository.findById(matriculaId);
        return updatedMatricula;
    },
    async deleteMatricula(matriculaId) {
        const existing = await matriculasRepository.findById(matriculaId);
        if (!existing) {
            throw new Error('Matrícula não encontrada');
        }
        await matriculasRepository.deleteMatricula(matriculaId);
    }
};