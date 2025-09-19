import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userRoutes from "./api/routes/user/userRoutes.js";
import cursoRouter from "./api/routes/cursos/cursosRouter.js";
import matriculasRouter from "./api/routes/matriculas/matriculasRouter.js";
import ongoingCourse from './api/controllers/cursos/cursoController.js';
import cookieParser from "cookie-parser";


// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Configurando views
app.set("view engine", "ejs");
app.set("views", "./views");

// Configurando diretório público
app.use(express.static("public"));

// Middleware para JSON
app.use(express.json());

// Middleware para formularios
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/users", userRoutes);
app.use("/cursos", cursoRouter);
app.use("/matriculas", matriculasRouter);

// Middleware para cookies
app.use(cookieParser());

// Middleware para extrair o token do cookie e passar para todas as rotas
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.clearCookie("jwt"); // limpa cookie expirado
        return res.status(401).json({ error: "Token expirado" });
      }
      console.error("Token inválido:", err.message);
      return res.status(401).json({ error: "Token inválido" });
    }
  }
  res.locals.user = user;
  next();
});

// Rotas para views
app.get("/", (req, res) => {
  res.render(
    "index",
    { user: res.locals.user || null, courses: [], categoria: "tecnologia" }
  );
});

app.get("/userScene", (req, res) => {
  if (!res.locals.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }
  res.render("userScene", { user: res.locals.user });
});

app.get("/courses", (req, res) => {
  if (!res.locals.user) {
    res.redirect("/register");
  }
  res.render("courses", { user: res.locals.user || null, courses: []});
}
);

app.get("/ongoingCourses", async (req, res) => {
  try {
    if (!res.locals.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const response = await fetch(`http://localhost:3000/matriculas/user/${res.locals.user.id}/courses`);
    const data = await response.json();
    if (!data || !data.cursosConcluidos || !data.cursosEmAndamento) {
      return res.status(500).json({ error: "Erro ao carregar cursos" });
    }
    res.render("ongoingCourses", { user: res.locals.user, cursosConcluidos: data.cursosConcluidos, cursosEmAndamento: data.cursosEmAndamento, matriculas: data.matriculas });
  } catch (error) {
    console.error("Erro ao carregar página de cursos em andamento:", error.message);
    return res.status(500).json({ error: "Erro ao carregar página de cursos em andamento" });
  }
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register", user: res.locals.user });
});

app.get("/edit", (req, res) => {
  if (!res.locals.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }
  res.render("edit", { user: res.locals.user });
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

// Tratamento de erros não tratados
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Inicializando servidor
app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
