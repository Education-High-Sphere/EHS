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
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Set cookie com token
      res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });

      res.redirect('/userScene');

    } catch (error) {
      res.redirect('/register?error=' + encodeURIComponent(error.message));
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
        { expiresIn: '7d' }
      );

      res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.redirect('/userScene');
    } catch (error) {
      res.redirect('/register?error=' + encodeURIComponent(error.message) + '&tab=login');
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
            const userId = req.body.id;
            const existingUser = await userRepository.findById(userId);
            if (!existingUser) {
                return res.redirect('/edit?error=' + encodeURIComponent('Usuário não encontrado'));
            }

            let avatarUrl = existingUser.avatar;

            // Se houver upload de imagem de avatar
            if (req.file) {
                const { supabase } = await import('../../../.config/db.js');
                if (supabase) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    // Usamos a extensão original do arquivo
                    const extension = req.file.originalname.split('.').pop();
                    const filePath = `avatar/avatar-${userId}-${uniqueSuffix}.${extension}`;

                    const { data, error } = await supabase.storage
                        .from('assets')
                        .upload(filePath, req.file.buffer, {
                            contentType: req.file.mimetype,
                            upsert: true
                        });

                    if (error) {
                        throw new Error('Erro no upload do avatar: ' + error.message);
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('assets')
                        .getPublicUrl(filePath);

                    avatarUrl = publicUrlData.publicUrl;
                } else {
                    console.warn("Supabase não configurado. Upload de avatar ignorado.");
                }
            }

            // Atualiza com avatar
            const updatedData = { ...req.body, avatar: avatarUrl };
            const updatedUser = await userService.updateUser(userId, updatedData);
            const payload = {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              phone: updatedUser.phone,
              createdAt: updatedUser.createdAt || updatedUser.created_at,
              job: updatedUser.job,
              roles: updatedUser.roles
            };
            const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.redirect('/edit?success=' + encodeURIComponent('Perfil atualizado com sucesso!'));
            
        } catch (error) {
            res.redirect('/edit?error=' + encodeURIComponent(error.message));
        }
    }
};
