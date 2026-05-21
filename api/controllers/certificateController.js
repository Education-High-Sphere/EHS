import certificateService from "../services/certificateService.js";
import matriculasService from "../services/matriculas/matriculasService.js";
import courseService from "../services/cursos/cursoService.js";
import professorService from "../services/professor/professorService.js";
import userService from "../services/user/userService.js";

export default {
  async downloadCertificate(req, res) {
    try {
      const { matriculaId } = req.params;
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const userId = req.user.id;

      // Buscar matrícula
      const matriculas = await matriculasService.getMatriculasByUser(userId);
      const matricula = matriculas.find(m => String(m.id) === String(matriculaId));

      if (!matricula) {
        return res.status(403).json({ message: "Matrícula não encontrada ou acesso negado." });
      }

      if (!matricula.concluido) {
        return res.status(400).json({ message: "O curso ainda não foi concluído." });
      }

      // Buscar dados para o certificado
      const course = await courseService.getCourseById(matricula.curso_id);
      const student = await userService.getProfile(userId);
      const professor = await professorService.getProfessorById(course.professor_id);
      const professorUser = await userService.getProfile(professor.user_id);

      const pdfBuffer = await certificateService.generateCertificate({
        studentName: student.name,
        courseName: course.nome,
        courseDuration: course.duracao || 'N/A',
        completionDate: new Date().toLocaleDateString('pt-BR'),
        professorName: professorUser.name
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Certificado-${course.nome.replace(/\s+/g, '_')}.pdf`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      res.status(500).json({ message: "Erro ao gerar certificado." });
    }
  }
};
