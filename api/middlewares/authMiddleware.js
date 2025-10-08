import jwt from 'jsonwebtoken';

// Middleware para verificar e disponibilizar o usuário logado (se houver)

export const checkUserMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  let user = null;

  if (token) {
    try {
      // Usamos verify para validar e decodificar
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Se o token for inválido ou expirado, apenas ignoramos.
      // A página não terá um usuário logado.
      console.log("Token inválido ou expirado:", err.message);
      res.clearCookie("jwt"); // Limpa o cookie inválido
    }
  }
  
  // Disponibiliza o usuário (ou null) para todas as views
  res.locals.user = user;
  next();
};
