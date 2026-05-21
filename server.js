// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolvendo __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { setupSearch } from "./api/services/searchService.js";
import { checkUserMiddleware } from './api/middlewares/authMiddleware.js';

// Importa os roteadores
import userRoutes from "./api/routes/user/userRoutes.js";
import cursoRouter from "./api/routes/cursos/cursosRouter.js";
import matriculasRouter from "./api/routes/matriculas/matriculasRouter.js";
import professorRoutes from "./api/routes/professor/professorRoutes.js";
import viewRoutes from "./api/routes/viewRoutes.js";
import progressRoutes from "./api/routes/progress/progressRoutes.js";
import contentRoutes from "./api/routes/cursos/contentRoutes.js";
import certificateRoutes from "./api/routes/certificateRoutes.js";


import swaggerUi from 'swagger-ui-express';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);

dotenv.config();
const app = express();

// --- CONFIGURAÇÃO INICIAL ---
await setupSearch();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// --- MIDDLEWARES GLOBAIS ---
app.use(checkUserMiddleware);

// --- ROTAS ---
app.use("/api/users", userRoutes);
app.use("/api/cursos", cursoRouter);
app.use("/api/matriculas", matriculasRouter);
app.use("/api/professors", professorRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/certificates", certificateRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas que renderizam páginas (views)
app.use("/", viewRoutes);

// --- TRATAMENTO DE ERROS E 404 ---

// Middleware para capturar rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).render("error", {
    message: "A página que você está procurando não existe ou foi movida.",
    user: req.user || null
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro Interno:", err);
  const statusCode = err.status || 500;
  res.status(statusCode).render("error", {
    message: err.message || "Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.",
    user: req.user || null
  });
});

// --- TRATAMENTO DE ERROS E INICIALIZAÇÃO ---
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aplicação rodando na porta ${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
