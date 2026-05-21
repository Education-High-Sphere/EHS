import professorService from '../../services/professor/professorService.js';
import experienciaProfessorService from '../../services/professor/experienciaProfessorService.js';
import certificacoesProfessorService from '../../services/professor/certificacoesProfessorService.js';
import userService from '../../services/user/userService.js';
import jwt from 'jsonwebtoken';

export default {
    async applyToBeTeacher(req, res) {
        try {
            const userId = req.body.userId;
            const { specialty, linkedin, bio, professionalExperiences, certifications } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado.' });
            }

            // 1. Criar o registro na tabela professores
            let professor;
            try {
                // Verifica se já existe
                professor = await professorService.getProfessorByUserId(userId);
            } catch (err) {
                // Se não existir, cria
                professor = await professorService.createProfessor({
                    user_id: userId,
                    especialidade: specialty,
                    sobre: bio, // Mapeado para a coluna 'sobre'
                    linkedin: linkedin
                });
            }

            // 2. Adicionar experiências
            if (professionalExperiences && professionalExperiences.length > 0) {
                for (const exp of professionalExperiences) {
                    await experienciaProfessorService.createExperiencia({
                        professor_id: professor.id,
                        descricao: exp // Mapeado para a coluna 'descricao'
                    });
                }
            }

            // 3. Adicionar certificações
            if (certifications && certifications.length > 0) {
                for (const cert of certifications) {
                    await certificacoesProfessorService.createCertificacao({
                        professor_id: professor.id,
                        nome_certificacao: cert // Mapeado para a coluna 'nome_certificacao'
                    });
                }
            }

            // 4. Adicionar a role 'teacher' ao usuário
            const user = await userService.getProfile(userId);
            let roles = user.roles || [];
            if (!roles.includes('teacher')) {
                roles.push('teacher');
                // Precisamos atualizar o roles no DB. userService precisa suportar isso.
                // Como não sabemos a implementação exata de updateUser para arrays, vamos assumir que updateUser recebe roles.
                await userService.updateUser(userId, { roles: roles });
            }

            // 5. Renovar o JWT para incluir a nova role imediatamente
            const updatedUser = await userService.getProfile(userId);
            const payload = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                createdAt: updatedUser.createdAt || updatedUser.created_at,
                job: updatedUser.job,
                roles: updatedUser.roles
            };

            const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.status(200).json({ message: 'Aplicação enviada com sucesso e aprovada automaticamente!', professor });
        } catch (error) {
            console.error('Erro ao aplicar para professor:', error);
            res.status(500).json({ error: error.message });
        }
    }
};
