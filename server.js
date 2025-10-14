// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import open from 'open';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolvendo __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { setupSearch } from "./api/services/searchService.js";
import { checkUserMiddleware } from './api/middlewares/authMiddleware.js'; // Importa o middleware

// Importa os roteadores
import userRoutes from "./api/routes/user/userRoutes.js";
import cursoRouter from "./api/routes/cursos/cursosRouter.js";
import matriculasRouter from "./api/routes/matriculas/matriculasRouter.js";
import viewRoutes from "./api/routes/viewRoutes.js"; // Importa as rotas de views

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.4',
    info: {
      title: 'Ehs - Aprendendo',
      description: 'tudo que você quer aprender e tudo que você não quer',
      version: '1.0.12',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos com comentários JSDoc
};

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);
// Middleware Swagger



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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas que renderizam páginas (views)
app.use("/", viewRoutes);

// --- TRATAMENTO DE ERROS E INICIALIZAÇÃO ---
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

app.listen(3000, () => {
  console.log("Aplicação rodando na porta 3000");
  console.log('Documentação Swagger: http://localhost:3000/api-docs');
  open('http://localhost:3000');
});