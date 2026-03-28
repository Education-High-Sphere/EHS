import userService from '../../services/user/userService.js';
import userRepository from '../../repositories/user/userRepository.js';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function verifyRecaptcha(token) {
  if (!token) return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

  try {
    const response = await fetch(url, { 
      method: 'POST',
      signal: controller.signal
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('reCAPTCHA verification error: Timeout reached (5s)');
    } else {
      console.error('reCAPTCHA verification error:', error.message);
    }
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}


export default {
  async register(req, res) {
    try {
      const { 'g-recaptcha-response': recaptchaToken } = req.body;
      const isHuman = await verifyRecaptcha(recaptchaToken);
      
      if (!isHuman) {
        return res.status(400).json({ error: 'Falha na verificação do reCAPTCHA' });
      }

      const user = await userService.register(req.body);

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt || user.created_at,
        job: user.job,
        roles: user.roles
      };

      // Cria token JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set cookie com token
      res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', secure: false });

      res.redirect('/userScene');

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { 'g-recaptcha-response': recaptchaToken } = req.body;
      const isHuman = await verifyRecaptcha(recaptchaToken);
      
      if (!isHuman) {
        return res.status(400).json({ error: 'Falha na verificação do reCAPTCHA' });
      }

      const user = await userService.login(req.body);

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt || user.created_at,
        job: user.job,
        roles: user.roles
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', secure: false });
      res.redirect('/userScene');
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
    async findAllUsers(req, res) {
        try {
        const users = await userService.findAll();
        res.json(users);
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    async logout(req, res) {
        try {
        res.clearCookie('jwt');
        res.redirect('/');
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    async updateUser(req, res) {
        try {
            console.log("Request Body:", req.body);
            console.log("Request File:", req.file);
            // Supondo que o ID do usuário esteja no corpo da requisição
            const userId = req.body.id;
            console.log("User ID from token:", userId);

            const existingUser = await userRepository.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            const updatedUser = await userService.updateUser(userId, req.body);
            const payload = {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
              createdAt: updatedUser.createdAt || updatedUser.created_at,
              job: updatedUser.job,
              roles: updatedUser.roles
            };
            const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'Lax', secure: false });
            res.redirect('/userScene');
            // Redireciona para a página do perfil do usuário
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
