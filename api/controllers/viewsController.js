import courseService from "../services/cursos/cursoService.js";
import matriculasController from "./matriculas/matriculasController.js";
import courseController from "./cursos/cursoController.js";
import courseContentService from "../services/cursos/cursoContentService.js";
import lessionsService from "../services/cursos/lessionsService.js";
import { getRandomDepoimentos } from "../services/details/depoimentoServices.js";
import { getAllDiferenciais } from "../services/details/diferenciaisServices.js";
import professorService from "../services/professor/professorService.js";
import experienciaProfessorService from "../services/professor/experienciaProfessorService.js";
import certificacoesProfessorService from "../services/professor/certificacoesProfessorService.js";
import userService from "../services/user/userService.js";

// Página Inicial
export const getHomePage = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.render("index", {
      user: res.locals.user || null,
      courses: courses,
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
    // Reutiliza a mesma lógica do controller da API!
    const { coursesData, categoria, searchQuery } =
      await courseController.listOrSearchCourses(req.query.search || "");
    const categoriasParaFiltro = [
      ...new Set(coursesData.map((course) => course.categoria)),
    ].filter((categoria) => categoria);


    res.render("courses", {
      user: res.locals.user || null,
      courses: coursesData,
      categoria: categoria,
      categories: categoriasParaFiltro,
      searchQuery: searchQuery || "",
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

    res.render("course", {
      user: res.locals.user || null,
      course: course,
      content: populatedContent,
      professor: professor,
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
    const data = await matriculasController.getMatriculasByUser(userId); // Chamada direta!
    res.render("ongoingCourses", {
      user: res.locals.user,
      cursosConcluidos: data.cursosConcluidos,
      cursosEmAndamento: data.cursosEmAndamento,
      matriculas: data.matriculas,
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
  if (!res.locals.user) return res.redirect("/register"); // Se não há user, não há cena de usuário

  console.log("Rendering userScene for user ID:", res.locals.user.id);
  const user = await userService.getProfile(res.locals.user.id); // Chamada direta!
  res.render("userScene", { user: user });
};

export const getTeacherScenePage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/register"); // Se não há user, não há cena de usuário

  console.log("Rendering teacherScene for user ID:", res.locals.user.id);
  const user = await userService.getProfile(res.locals.user.id); // Chamada direta!
  const professorInfo = await professorService.getProfessorByUserId(
    res.locals.user.id
  );
  const courses = await courseService.getCoursesByProfessorId(professorInfo.id);

  res.render("teacherScene", {
    user: user,
    professor: professorInfo,
    courses: courses,
  });
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
  const course = await courseService.getCourseById(req.params.id);

  if (res.locals.user.roles.includes("teacher")) {
    res.render("editACourse", { user: res.locals.user, course: course });
  } else {
    res.redirect("/beATeacher");
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};
