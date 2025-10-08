// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import open from 'open';

import { setupSearch } from "./api/services/searchService.js";
import { checkUserMiddleware } from './api/middlewares/authMiddleware.js'; // Importa o middleware

// Importa os roteadores
import userRoutes from "./api/routes/user/userRoutes.js";
import cursoRouter from "./api/routes/cursos/cursosRouter.js";
import matriculasRouter from "./api/routes/matriculas/matriculasRouter.js";
import viewRoutes from "./api/routes/viewRoutes.js"; // Importa as rotas de views

dotenv.config();
const app = express();

// --- CONFIGURAÇÃO INICIAL ---
await setupSearch();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- MIDDLEWARES GLOBAIS ---
app.use(checkUserMiddleware); // Middleware de autenticação para TODAS as rotas

// --- ROTAS ---
// Rotas da API (prefixo /api para diferenciar)
app.use("/api/users", userRoutes);
app.use("/api/cursos", cursoRouter);
app.use("/api/matriculas", matriculasRouter);

// Rotas que renderizam páginas (views)
app.use("/", viewRoutes);

// --- TRATAMENTO DE ERROS E INICIALIZAÇÃO ---
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

app.listen(3000, () => {
  console.log("Aplicação rodando na porta 3000");
  open('http://localhost:3000');
});