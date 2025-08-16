import express from "express";
import jwt from "jsonwebtoken";
import userRoutes from "./api/routes/user/userRoutes.js";

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

// Rotas para views
app.get("/", (req, res) => {
  res.render("index", { title: "EHSYNC" });
});

app.get("/userScene", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("/register");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render("userScene", { title: "User Scene", user: decoded });
  } catch (err) {
    return res.redirect("/register");
  }
  
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

// Tratamento de erros não tratados
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", reason.stack || reason);
});

// Inicializando servidor
app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
