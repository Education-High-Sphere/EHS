# EHS MVP — Plano de Implementação Completo

Transformar o EHS de um catálogo de cursos com login em uma plataforma de educação funcional, cobrindo: player de vídeo, inscrição real, dashboard dinâmico, fluxo de professor, certificados, avaliações, paginação, design system, e correções de bugs.

## Open Questions

> [!IMPORTANT]
> **Banco de Dados**: As tabelas `aulas`, `conteudos_curso`, `usuarios_cursos`, `professores`, `experiencias_professor`, `certificacoes_professor` já existem no Supabase. Precisarei criar novas tabelas/colunas:
> - `aulas`: adicionar coluna `video_url` (text), `ordem` (integer), `duracao_minutos` (integer) — **essas colunas já existem?**
> - `usuarios_cursos`: adicionar `concluido` (boolean), `progresso` (float) — **já existem?**
> - Nova tabela `aulas_concluidas` (user_id, aula_id, concluida_em)
> - Nova tabela `avaliacoes` (user_id, curso_id, nota, comentario, created_at)
> - Tabela `users`: adicionar coluna `avatar` (text) — **já existe?**
> - Tabela `users`: coluna `roles` — **é text[] ou text? qual formato?**

> [!IMPORTANT]
> **Vídeos**: O plano usa links externos (YouTube/Vimeo embed URLs) para as aulas, não upload direto. Upload de vídeo para Supabase Storage seria muito lento e caro. **Isso está ok?**

> [!IMPORTANT]
> **Fluxo "Seja Professor"**: Ao submeter o formulário, o usuário automaticamente se torna professor (role `teacher` adicionada) ou precisa de aprovação manual? O plano assume **aprovação automática** por ser MVP.

---

## Proposed Changes

### Fase 1 — Correções de Bugs e Infraestrutura

Corrigir todos os bugs identificados e preparar a base para as novas features.

#### [MODIFY] [cursoContentService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/cursos/cursoContentService.js)
- Linha 34: `createContent()` não retorna `newContent`. Adicionar `return newContent;`

#### [MODIFY] [lessionsService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/cursos/lessionsService.js)
- Linha 63: falta `};` no final do export. Corrigir syntax.
- Linha 13: método `findLessionById` chama `findLessionById` no repo mas o repo tem `findLessionsById` (com 's'). Unificar nomes.

#### [MODIFY] [professorService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/professor/professorService.js)
- `getProfessorById` chama `professorRepository.findById(id)` mas o repo busca por `user_id` não por `id` do professor. Adicionar método `findByProfessorId` ao repo ou corrigir a query.
- `getProfessorByUserId` chama `findByUserId` que não existe no repo (o repo tem `findById` que busca por `user_id`). Alinhar nomes.

#### [MODIFY] [professorRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/professor/professorRepository.js)
- Renomear/adicionar métodos para clareza: `findByUserId(userId)` e `findByProfessorId(id)` como queries separadas.

#### [DELETE] [googleAuth.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/auth/googleAuth.js)
- Mistura CommonJS com ES Modules, usa placeholder `YOUR_CLIENT_ID`, nunca é importado. Remover arquivo morto.

#### [MODIFY] [viewsController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/viewsController.js)
- Linha 113: `matriculasController.getMatriculasByUser(userId)` — essa função espera `(req, res)`, não `(userId)`. Refatorar para chamar o **service** diretamente em vez do controller.

#### [MODIFY] [server.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/server.js)
- Adicionar `cors` (já é dependência mas não está sendo usado).
- Usar `process.env.PORT` com fallback para 3000.

#### [NEW] [.env.example](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/.env.example)
- Criar arquivo template sem valores reais para documentação.

#### [MODIFY] [.gitignore](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/.gitignore)
- Garantir que `.env` está listado (já deve estar, mas confirmar).

---

### Fase 2 — Design System Global + Página de Erro

#### [NEW] [global.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/global.css)
- CSS variáveis globais: cores (`--cor-fundo`, `--cor-acento-azul`, etc.), tipografia, espaçamentos, border-radius, sombras.
- Reset CSS unificado (tirar do header.ejs).
- Classes utilitárias: `.container`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`.
- Componentes globais: cards, form inputs, progress bars, badges, empty states.
- Responsividade base com breakpoints.

#### [MODIFY] [header.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/common/header.ejs)
- Mover o CSS inline (~215 linhas) para `global.css`.
- Adicionar `<link>` para `global.css` em vez do `<style>` inline.
- Adicionar menu hamburger para mobile.

#### [NEW] [error.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/error.ejs)
- Página de erro genérica com design consistente, recebendo `message` como variável.
- Botão "Voltar para Home".

#### [NEW] [error.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/error.css)

---

### Fase 3 — Cadastro Simplificado + Refresh Token

#### [MODIFY] [register.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/register.ejs)
- **Simplificar cadastro** para apenas: Nome, Email, Senha, Confirmar Senha, Termos.
- Remover campos obrigatórios do cadastro: `birth_date`, `email_confirm`, `job`, `phone` — esses ficam opcionais na edição de perfil depois.
- Manter formulário de Login como está.

#### [MODIFY] [userRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/user/userRepository.js)
- `createUser()`: tornar `job`, `birth_date`, `phone` opcionais (não enviar se não existirem).

#### [MODIFY] [userService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/user/userService.js)
- `register()`: aceitar apenas `name`, `email`, `password` como obrigatórios.

#### [MODIFY] [userControllers.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/user/userControllers.js)
- **Refresh token**: aumentar expiração JWT para `7d` (7 dias) em vez de `1h`.
- Adicionar endpoint `POST /api/users/refresh` que renova o token se ainda válido.
- No `register` e `login`: setar cookie com `maxAge: 7 * 24 * 60 * 60 * 1000`.

#### [MODIFY] [authMiddleware.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/middlewares/authMiddleware.js)
- Auto-refresh: se token está perto de expirar (< 1 dia), renovar automaticamente.

---

### Fase 4 — Edição de Perfil Completa com Avatar

#### [MODIFY] [edit.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/edit.ejs)
- Adicionar HTML5 doctype completo (atualmente falta `<!DOCTYPE html>`).
- Formulário completo: nome, email, telefone, cargo, data de nascimento, avatar, senha.
- Corrigir `action` do form: de `/users/edit` para `/api/users/edit`.
- Adicionar feedback visual de sucesso/erro.
- Melhorar CSS com design system.

#### [MODIFY] [edit.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/edit.css)
- Redesign completo usando design system global.

#### [MODIFY] [userControllers.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/user/userControllers.js)
- `updateUser()`: processar `req.file` (avatar) — fazer upload para Supabase Storage, salvar URL no banco.

#### [MODIFY] [multer.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/middlewares/multer.js)
- Mudar de `diskStorage` para `memoryStorage` (para upload direto ao Supabase Storage, igual ao que já faz com imagens de cursos).

---

### Fase 5 — Fluxo "Seja Professor" Conectado ao Banco

#### [MODIFY] [beATeacher.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/beATeacher.ejs)
- Substituir o `setTimeout` simulado por `fetch` real para `POST /api/professors/apply`.
- Enviar dados: specialty, linkedin, bio, experiences[], certifications[].

#### [NEW] [professorController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/professor/professorController.js)
- `applyAsTeacher(req, res)`:
  1. Verificar se user está autenticado.
  2. Criar registro na tabela `professores` com `user_id`, `sobre` (bio), `especialidade`, `linkedin`.
  3. Inserir experiências na tabela `experiencias_professor`.
  4. Inserir certificações na tabela `certificacoes_professor`.
  5. Adicionar role `teacher` ao user.
  6. Renovar JWT com nova role.

#### [NEW] [professorRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/professor/professorRoutes.js)
- `POST /api/professors/apply` — protegido por auth.

#### [MODIFY] [professorService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/professor/professorService.js)
- Adicionar `createProfessor(data)`.

#### [MODIFY] [server.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/server.js)
- Registrar nova rota `app.use("/api/professors", professorRoutes)`.

#### [MODIFY] [userRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/user/userRepository.js)
- Adicionar `addRole(userId, role)` para append na coluna `roles`.

---

### Fase 6 — Página do Curso Funcional + Inscrição Real

#### [MODIFY] [course.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/course.ejs)
- **Imagem real**: usar `course.imagem` quando existir, manter placeholder Unsplash como fallback.
- **Botão "Inscreva-se"**: substituir `<a href="#">` por botão funcional com `fetch POST /api/matriculas`.
- Se user já matriculado → mostrar "Continuar Curso" que leva para `/watch/:courseId`.
- Se user não logado → redirecionar para `/register`.
- Remover seção "Planos Corporativos" (irrelevante nessa página).
- Corrigir depoimentos/diferenciais: passar dados pela controller ou remover seção.

#### [MODIFY] [viewsController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/viewsController.js)
- `getCourseDetailPage`: verificar se user está matriculado (se logado) e passar `isEnrolled` para a view.
- Buscar e passar `depoimentos` e `diferenciais` (ou remover da view).

#### [MODIFY] [course.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/course.css)
- Ajustes para usar design system e responsividade.

---

### Fase 7 — Player de Vídeo / Assistir Aula

A feature mais importante que está faltando.

#### [NEW] [watchCourse.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/watchCourse.ejs)
- Layout: sidebar esquerda com lista de módulos/aulas + área principal com player.
- Player: `<iframe>` para YouTube/Vimeo embed ou `<video>` para links diretos.
- Sidebar mostra módulos expandíveis com checkmarks de aulas concluídas.
- Botão "Marcar como Concluída" que faz `POST /api/progress/complete`.
- Navegação: "Próxima Aula" / "Aula Anterior".
- Barra de progresso geral do curso no topo.

#### [NEW] [watchCourse.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/watchCourse.css)
- Layout responsivo: em mobile, sidebar vira dropdown/accordion acima do player.

#### [NEW] [progressController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/progress/progressController.js)
- `completeLesson(req, res)`: marcar aula como concluída em `aulas_concluidas`, recalcular progresso na matrícula.
- `getCourseProgress(req, res)`: retornar lista de aulas concluídas para um curso/user.

#### [NEW] [progressService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/progress/progressService.js)
- `markLessonComplete(userId, lessonId)`: inserir em `aulas_concluidas`, calcular % (aulas concluídas / total aulas do curso), atualizar `usuarios_cursos.progresso`.
- `getCompletedLessons(userId, courseId)`: retornar IDs das aulas concluídas.

#### [NEW] [progressRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/progress/progressRepository.js)
- CRUD para tabela `aulas_concluidas`.

#### [NEW] [progressRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/progress/progressRoutes.js)
- `POST /api/progress/complete` — body: `{ lessonId }`
- `GET /api/progress/:courseId` — retorna progresso do user no curso.

#### [MODIFY] [viewsController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/viewsController.js)
- Adicionar `getWatchCoursePage(req, res)`: verificar matrícula, carregar módulos/aulas, aulas concluídas, e renderizar `watchCourse`.

#### [MODIFY] [viewRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/viewRoutes.js)
- Adicionar `GET /watch/:courseId/:lessonId?` (lessonId opcional, default = primeira aula).

#### [MODIFY] [server.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/server.js)
- Registrar `app.use("/api/progress", progressRoutes)`.

---

### Fase 8 — Dashboard do Aluno com Dados Reais

#### [MODIFY] [userScene.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/userScene.ejs)
- **Remover todo HTML hardcoded** de cursos (linhas 117-232).
- Substituir por loop dinâmico `<% cursosEmAndamento.forEach(...) %>` usando dados reais.
- Stats (cursos concluídos, em andamento, horas) calculados no backend.
- Tab "Certificados": listar certificados reais ou empty state.
- Botão "Retomar Curso" linka para `/watch/:courseId`.

#### [MODIFY] [viewsController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/viewsController.js)
- `getUserScenePage`: buscar matrículas do user, separar em andamento/concluídos, calcular stats, passar para view.

#### [MODIFY] [ongoingCourses.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/ongoingCourses.ejs)
- Botão "Continuar Curso" → link para `/watch/:courseId`.
- Botão "Ver Certificado" → link para `/certificate/:matriculaId`.

---

### Fase 9 — Gestão de Módulos e Aulas (Professor)

#### [MODIFY] [editACourse.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/editACourse.ejs)
- Adicionar seção abaixo do formulário de metadados: "Conteúdo do Curso".
- UI para adicionar/editar/remover módulos (`conteudos_curso`).
- Dentro de cada módulo: adicionar/editar/remover aulas com campos: título, descrição, URL do vídeo (YouTube/Vimeo), ordem.
- Accordion/collapsible para organizar visualmente.
- Drag & drop para reordenar (opcional, pode ser botões ↑↓).

#### [NEW] [contentRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/cursos/contentRoutes.js)
- CRUD para módulos: `POST/PUT/DELETE /api/cursos/:courseId/content`
- CRUD para aulas: `POST/PUT/DELETE /api/cursos/:courseId/content/:contentId/lessons`

#### [NEW] [contentController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/cursos/contentController.js)
- Handlers para CRUD de módulos e aulas, com verificação de ownership (professor dono do curso).

#### [MODIFY] [server.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/server.js)
- Registrar content routes.

---

### Fase 10 — Avaliações de Cursos

#### [NEW] [avaliacaoRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/cursos/avaliacaoRepository.js)
- CRUD para tabela `avaliacoes` (user_id, curso_id, nota 1-5, comentario, created_at).
- `getAverageRating(courseId)` — calcula média.

#### [NEW] [avaliacaoService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/cursos/avaliacaoService.js)
- `createReview(userId, courseId, nota, comentario)`: verificar que user concluiu o curso, verificar que não avaliou antes.
- `getReviewsByCourse(courseId)`: listar avaliações com nome do user.

#### [NEW] [avaliacaoController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/cursos/avaliacaoController.js)

#### [MODIFY] [course.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/course.ejs)
- Adicionar seção de avaliações reais no lugar dos depoimentos hardcoded.

#### [MODIFY] [watchCourse.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/watchCourse.ejs)
- Ao concluir 100% do curso, mostrar modal/seção para avaliar.

---

### Fase 11 — Certificados (PDF Simples)

#### [NEW] [certificateService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/certificateService.js)
- Gerar PDF com `pdfkit` (nova dependência).
- Template simples: logo EHS, nome do aluno, nome do curso, data de conclusão, nome do professor.

#### [NEW] [certificateController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/certificateController.js)
- `GET /api/certificates/:matriculaId` — verificar que matrícula está concluída, gerar e retornar PDF.

#### [NEW] [certificateRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/certificateRoutes.js)

#### [MODIFY] [viewRoutes.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/routes/viewRoutes.js)
- `GET /certificate/:matriculaId` — redireciona para download do PDF.

---

### Fase 12 — Paginação

#### [MODIFY] [cursoRepository.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/repositories/cursos/cursoRepository.js)
- `findAll()` → `findAll({ page, limit })` com `OFFSET` e `LIMIT` + `COUNT(*)` para total.
- `findByCategoria()` → mesma lógica.

#### [MODIFY] [cursoService.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/services/cursos/cursoService.js)
- Propagar parâmetros de paginação.

#### [MODIFY] [courses.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/courses.ejs)
- Adicionar componente de paginação no final: « 1 2 3 ... N ».

#### [MODIFY] [viewsController.js](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/api/controllers/viewsController.js)
- `getCoursesPage`: ler `req.query.page`, passar para service, enviar `pagination` para view.

---

### Fase 13 — Comunidades (Mockup Melhorado)

#### [MODIFY] [communities.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/communities.ejs)
- Manter como mockup visual, mas melhorar design com design system global.
- Botões "Entrar na Comunidade" → mostrar toast "Em breve!" em vez de não fazer nada.
- Adicionar badge "Em breve" nas comunidades.

#### [MODIFY] [communities.css](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/public/styles/communities.css)
- Atualizar com design system.

---

### Fase 14 — Imagens nos Cursos (Fallback)

#### [MODIFY] [index.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/index.ejs)
- Na função `filterCategory`: usar `course.imagem` quando existir, placeholder como fallback.

#### [MODIFY] [courses.ejs](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/views/courses.ejs)
- Mesma lógica: `course.imagem || placeholderUrl`.

---

### Novas Dependências

#### [MODIFY] [package.json](file:///c:/Users/Levi%20Arcanjo/Documents/EHS/package.json)
- Adicionar `pdfkit` (geração de certificados PDF).

---

## SQL Migrations Necessárias

```sql
-- Coluna video_url nas aulas (se não existir)
ALTER TABLE aulas ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE aulas ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;
ALTER TABLE aulas ADD COLUMN IF NOT EXISTS duracao_minutos INTEGER DEFAULT 0;

-- Progresso na matrícula
ALTER TABLE usuarios_cursos ADD COLUMN IF NOT EXISTS concluido BOOLEAN DEFAULT FALSE;
ALTER TABLE usuarios_cursos ADD COLUMN IF NOT EXISTS progresso FLOAT DEFAULT 0;

-- Avatar do user
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Aulas concluídas
CREATE TABLE IF NOT EXISTS aulas_concluidas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  aula_id INTEGER REFERENCES aulas(id) ON DELETE CASCADE,
  concluida_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, aula_id)
);

-- Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, curso_id)
);
```

---

## Verification Plan

### Automated Tests
- Rodar `npm test` para garantir que testes existentes não quebraram.
- Testar manualmente cada fluxo no browser:
  1. Cadastro simplificado → login → dashboard com dados reais
  2. Navegar cursos → página do curso → inscrever-se → assistir aula → marcar concluída
  3. Concluir curso → avaliar → baixar certificado
  4. Fluxo professor: "Seja professor" → criar curso → adicionar módulos/aulas → publicar
  5. Editar perfil com avatar
  6. Paginação na listagem de cursos
  7. Página de erro (acessar rota inexistente)

### Manual Verification
- Testar responsividade em viewport mobile (375px) e desktop (1440px).
- Verificar que nenhuma credencial real está exposta no código commitado.
- Validar que o player de vídeo funciona com URLs YouTube e Vimeo.
