const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
import db from '../../config/db.js'; // Import your database connection

const clientId = 'YOUR_CLIENT_ID';

router.post('/api/auth/googleAuth', async (req, res) => {
  const { idToken } = req.body;
  
  try {
    // Verifica token com Google
    const userData = await verifyIdToken(idToken, clientId);

    if (!userData) {
      return res.status(401).json({ success: false, message: "Token inválido" });
    }

    const { name, email, picture } = userData;

    // 1. Verifica se já existe no banco
    let user = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user.length) {
      // 2. Se não existe, cria novo
      await db.query(
        "INSERT INTO users (name, email) VALUES (?, ? )",
        [name, email]
      );
    }

    // 3. Retorna sucesso
    res.json({ success: true, user: { name, email } });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

module.exports = router;
