import courseService from "../services/cursos/cursoService.js";
import matriculasService from "../services/matriculas/matriculasService.js";
import courseController from "./cursos/cursoController.js";
import courseContentService from "../services/cursos/cursoContentService.js";
import lessionsService from "../services/cursos/lessionsService.js";
import { getRandomDepoimentos } from "../services/details/depoimentoServices.js";
import { getAllDiferenciais } from "../services/details/diferenciaisServices.js";
import professorService from "../services/professor/professorService.js";
import experienciaProfessorService from "../services/professor/experienciaProfessorService.js";
import certificacoesProfessorService from "../services/professor/certificacoesProfessorService.js";
import userService from "../services/user/userService.js";
import progressService from "../services/progress/progressService.js";
import avaliacaoService from "../services/cursos/avaliacaoService.js";


// Página Inicial
export const getHomePage = async (req, res) => {
  try {
    const result = await courseService.getAllCourses();
    let recommendedCourseIds = [];

    if (res.locals.user) {
      try {
        const matriculas = await matriculasService.getMatriculasByUser(res.locals.user.id);
        if (matriculas && matriculas.length > 0) {
          const enrolledIds = matriculas.map((m) => String(m.curso_id));
          const enrolledCourses = result.courses.filter((c) => enrolledIds.includes(String(c.id)));
          
          const userCategories = [...new Set(enrolledCourses.map((c) => c.categoria))];
          
          const recommended = result.courses.filter(
            (c) => userCategories.includes(c.categoria) && !enrolledIds.includes(String(c.id))
          );
          
          recommendedCourseIds = recommended.map((c) => c.id);
        }
      } catch (err) {
        console.error("Erro ao buscar recomendações:", err.message);
      }
    }

    res.render("index", {
      user: res.locals.user || null,
      courses: result.courses,
      recommendedCourseIds: recommendedCourseIds,
      categoria: "tecnologia",
    });
  } catch (error) {
    console.error("Erro ao carregar página inicial:", error.message);
    res
      .status(500)
      .render("error", { message: "Não foi possível carregar os cursos." });
  }
};

// Página de Cursos (com busca)
export const getCoursesPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // Reutiliza a mesma lógica do controller da API!
    const { coursesData, categoria, searchQuery, currentPage, totalPages } =
      await courseController.listOrSearchCourses(req.query.search || "", page);
    
    // Obter todas as categorias existentes (poderíamos fazer uma query extra, 
    // mas vamos mapear do que está na tela ou usar fixas para o MVP).
    // Como coursesData agora é só 1 página, mapear categorias daqui é limitado, 
    // mas o filtro no frontend continuará funcionando.
    const categoriasParaFiltro = [
      ...new Set(coursesData.map((course) => course.categoria)),
    ].filter((categoria) => categoria);


    res.render("courses", {
      user: res.locals.user || null,
      courses: coursesData,
      categoria: categoria,
      categories: categoriasParaFiltro,
      searchQuery: searchQuery || "",
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Erro ao carregar página de cursos:", error.message);
    res
      .status(500)
      .render("error", { message: "Não foi possível carregar os cursos." });
  }
};

// Página de Detalhe do Curso
export const getCourseDetailPage = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await courseService.getCourseById(id); // Chamada direta!
    const professor_id = course.professor_id;
    const professor = await professorService.getProfessorById(professor_id); // Chamada direta!

    if (!course) {
      return res
        .status(404)
        .render("error", { message: "Curso não encontrado." });
    }
    const courseContentList = await courseContentService.getContentByCourseId(
      id
    ); // Chamada direta!
    const populatedContent = await Promise.all(
      courseContentList.map(async (contentItem) => {
        const lessions = await lessionsService.getLessionsByContentId(
          contentItem.id
        );
        return { ...contentItem, lessions };
      })
    );

    const experienciaList =
      await experienciaProfessorService.getexperienciaProfessorById(
        professor.id
      );
    professor.experiencias = experienciaList;
    const certificacoesList =
      await certificacoesProfessorService.getcertificacoesProfessorById(
        professor.id
      );
    professor.certificacoes = certificacoesList;
    const professorInfo = await userService.getProfile(professor.user_id);
    professor.nome = professorInfo.name;
    professor.cargo = professorInfo.cargo;

    let isEnrolled = false;
    if (res.locals.user) {
      const matriculas = await matriculasService.getMatriculasByUser(
        res.locals.user.id
      );
      isEnrolled = matriculas.some((m) => String(m.curso_id) === String(id));
    }

    const reviews = await avaliacaoService.getReviewsByCourse(id);

    res.render("course", {
      user: res.locals.user || null,
      course: course,
      content: populatedContent,
      professor: professor,
      isEnrolled: isEnrolled,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Erro ao carregar página do curso:", error.message);
    res.status(500).render("error", { message: "Erro ao carregar o curso." });
  }
};

// Página "Meus Cursos"
export const getOngoingCoursesPage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/"); // Se não há user, não há cursos

  try {
    const userId = res.locals.user.id;
    const matriculas = await matriculasService.getMatriculasByUser(userId);

    if (!matriculas || matriculas.length === 0) {
      return res.render("ongoingCourses", {
        user: res.locals.user,
        cursosConcluidos: [],
        cursosEmAndamento: [],
        matriculas: [],
      });
    }

    const cursosIds = matriculas.map((m) => m.curso_id);
    const cursos = await courseService.getCoursesByIds(cursosIds);

    const cursosConcluidos = cursos
      .filter((c) => matriculas.some((m) => m.curso_id === c.id && m.concluido))
      .map((c) => ({
        ...c,
        matricula: matriculas.find((m) => m.curso_id === c.id && m.concluido),
      }));

    const cursosEmAndamento = cursos
      .filter((c) => matriculas.some((m) => m.curso_id === c.id && !m.concluido))
      .map((c) => ({
        ...c,
        matricula: matriculas.find((m) => m.curso_id === c.id && !m.concluido),
      }));

    res.render("ongoingCourses", {
      user: res.locals.user,
      cursosConcluidos,
      cursosEmAndamento,
      matriculas,
    });
  } catch (error) {
    console.error(
      "Erro ao carregar página de cursos em andamento:",
      error.message
    );
    res
      .status(500)
      .render("error", { message: "Erro ao carregar seus cursos." });
  }
};

// Outras páginas estáticas
export const getRegisterPage = (req, res) =>
  res.render("register", { user: res.locals.user });
export const getEditPage = (req, res) =>
  res.render("edit", { user: res.locals.user });
export const getCommunitiesPage = (req, res) =>
  res.render("communities", { user: res.locals.user });
export const getBeATeacherPage = (req, res) => {
  if (!res.locals.user) {
    return res.redirect("/register");
  }

  const hasTeacherRole = (user) => {
    return user && user.roles && user.roles.includes("teacher");
  };

  if (hasTeacherRole(res.locals.user)) {
    return res.redirect("/teacherScene");
  } else {
    res.render("beATeacher", { user: res.locals.user });
  }
};

export const getUserScenePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register");

  try {
    const userId = res.locals.user.id;
    const user = await userService.getProfile(userId);
    const matriculas = await matriculasService.getMatriculasByUser(userId);

    if (!matriculas || matriculas.length === 0) {
      return res.render("userScene", {
        user,
        cursosEmAndamento: [],
        cursosConcluidos: [],
        stats: {
          concluidos: 0,
          emAndamento: 0,
          horasEstudo: 0,
          avaliacoes: 0
        }
      });
    }

    const cursosIds = matriculas.map((m) => m.curso_id);
    const courses = await courseService.getCoursesByIds(cursosIds);

    // Enriquecer cursos com dados do professor e progresso
    const populatedCourses = await Promise.all(
      courses.map(async (course) => {
        const matricula = matriculas.find((m) => String(m.curso_id) === String(course.id));
        const professor = await professorService.getProfessorById(course.professor_id);
        const professorUser = await userService.getProfile(professor.user_id);
        
        // Buscar total de aulas para mostrar "X de Y aulas concluídas"
        const content = await courseContentService.getContentByCourseId(course.id);
        let totalLessons = 0;
        for (const module of content) {
          const lessons = await lessionsService.getLessionsByContentId(module.id);
          totalLessons += lessons.length;
        }

        const completedLessons = await progressService.getCourseProgress(userId, course.id);
        const numCompleted = completedLessons.length;

        return {
          ...course,
          professorName: professorUser.name,
          progress: matricula.progresso || 0,
          isConcluido: matricula.concluido || false,
          numCompleted,
          totalLessons,
          matriculaId: matricula.id
        };
      })
    );

    const cursosEmAndamento = populatedCourses.filter((c) => !c.isConcluido);
    const cursosConcluidos = populatedCourses.filter((c) => c.isConcluido);

    // Calcular stats
    const totalHoras = populatedCourses.reduce((acc, c) => {
      // Aqui poderíamos somar a duração das aulas concluídas se tivéssemos essa info fácil
      // Por enquanto vamos simular ou usar um valor padrão por aula
      return acc + (c.numCompleted * 15); // Ex: 15 min por aula
    }, 0);

    const stats = {
      concluidos: cursosConcluidos.length,
      emAndamento: cursosEmAndamento.length,
      horasEstudo: Math.round(totalHoras / 60),
      avaliacoes: 0 // TODO: Buscar avaliações reais na Fase 10
    };

    res.render("userScene", {
      user,
      cursosEmAndamento,
      cursosConcluidos,
      stats
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard do aluno:", error);
    res.status(500).render("error", { message: "Erro ao carregar seu dashboard." });
  }
};

export const getTeacherScenePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register"); // Se não há user, não há cena de usuário

  console.log("Rendering teacherScene for user ID:", res.locals.user.id);
  const user = await userService.getProfile(res.locals.user.id); // Chamada direta!
  try {
    const professorInfo = await professorService.getProfessorByUserId(res.locals.user.id);
    const courses = await courseService.getCoursesByProfessorId(professorInfo.id);

    res.render("teacherScene", {
      user: user,
      professor: professorInfo,
      courses: courses,
    });
  } catch (error) {
    console.error("Erro ao carregar teacherScene:", error.message);
    // Se o usuário tem a role mas não tem o registro de professor, redireciona para criar
    res.redirect("/beATeacher");
  }
};

export const getCreateACoursePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register");

  if (res.locals.user.roles.includes("teacher")) {
    res.render("createACourse", { user: res.locals.user });
  } else {
    res.redirect("/beATeacher");
  }
};

export const getEditACoursePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register");
  
  try {
    const courseId = req.params.id;
    const course = await courseService.getCourseById(courseId);

    if (!res.locals.user.roles.includes("teacher")) {
      return res.redirect("/beATeacher");
    }

    // Carregar módulos e aulas
    const content = await courseContentService.getContentByCourseId(courseId);
    const populatedContent = await Promise.all(
      content.map(async (module) => {
        const lessons = await lessionsService.getLessionsByContentId(module.id);
        return { ...module, lessons };
      })
    );

    res.render("editACourse", { 
      user: res.locals.user, 
      course: course,
      content: populatedContent
    });
  } catch (error) {
    console.error("Erro ao carregar página de edição de curso:", error);
    res.status(500).render("error", { message: "Erro ao carregar o curso." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

export const getWatchCoursePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register");

  try {
    const { courseId, lessonId } = req.params;
    const userId = res.locals.user.id;

    // Verificar matrícula
    const matriculas = await matriculasService.getMatriculasByUser(userId);
    const matricula = matriculas.find((m) => String(m.curso_id) === String(courseId));

    if (!matricula) {
      return res
        .status(403)
        .render("error", { message: "Você não está matriculado neste curso." });
    }

    // Carregar dados do curso
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).render("error", { message: "Curso não encontrado." });
    }

    // Carregar conteúdo (módulos e aulas)
    const courseContentList = await courseContentService.getContentByCourseId(courseId);
    
    // Ordenar módulos por ordem
    courseContentList.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

    const populatedContent = await Promise.all(
      courseContentList.map(async (contentItem) => {
        const lessions = await lessionsService.getLessionsByContentId(contentItem.id);
        // Ordenar aulas por ordem dentro do módulo
        const sortedLessions = (lessions || []).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        return { ...contentItem, lessions: sortedLessions };
      })
    );

    // Carregar progresso
    const completedLessons = await progressService.getCourseProgress(userId, courseId);

    // Encontrar a aula atual
    let currentLesson = null;
    const allLessons = populatedContent.flatMap((module) => module.lessions || []);

    if (lessonId) {
      currentLesson = allLessons.find((l) => String(l.id) === String(lessonId));
    } else {
      // Se não especificou aula, pega a primeira não concluída ou a primeira do curso
      currentLesson =
        allLessons.find((l) => !completedLessons.includes(l.id)) ||
        allLessons[0] || null;
    }

    res.render("watchCourse", {
      user: res.locals.user,
      course,
      content: populatedContent,
      completedLessons,
      currentLesson,
      progress: matricula.progresso || 0,
      hasRated: await avaliacaoService.getUserRating(userId, courseId),
    });
  } catch (error) {
    console.error("Erro ao carregar página de aula:", error);
    res.status(500).render("error", { message: "Erro ao carregar a aula: " + error.message });
  }
};

