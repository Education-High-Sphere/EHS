import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userRoutes from "./api/routes/user/userRoutes.js";
import cursoRouter from "./api/routes/cursos/cursosRouter.js";
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
  res.locals.RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
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
