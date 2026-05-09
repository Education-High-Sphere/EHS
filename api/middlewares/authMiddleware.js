import jwt from 'jsonwebtoken';

// Middleware para verificar e disponibilizar o usuário logado (se houver)

export const checkUserMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  let user = null;

  if (token) {
    try {
      // Usamos verify para validar e decodificar
      user = jwt.verify(token, process.env.JWT_SECRET);
      
      // Auto-refresh: se faltar menos de 1 dia para expirar, renova por 7 dias
      const now = Math.floor(Date.now() / 1000);
      if (user.exp - now < 24 * 60 * 60) {
        const payload = { ...user };
        delete payload.iat;
        delete payload.exp;
        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
      }
    } catch (err) {
      // Se o token for inválido ou expirado, apenas ignoramos.
      // A página não terá um usuário logado.
      console.log("Token inválido ou expirado:", err.message);
      res.clearCookie("jwt"); // Limpa o cookie inválido
    }
  }
  
  // Disponibiliza o usuário (ou null) e o site key do reCAPTCHA para todas as views
  req.user = user;
  res.locals.user = user;
  res.locals.RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
  next();
};

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Faça login para continuar." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    console.log("Erro na autenticação de API:", err.message);
    return res.status(403).json({ message: "Sessão inválida ou expirada. Faça login novamente." });
  }
};
