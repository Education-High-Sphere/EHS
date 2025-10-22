import userService from '../../services/user/userService.js';
import userRepository from '../../repositories/user/userRepository.js';
import jwt from 'jsonwebtoken';


export default {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);

      const payload = {id: user.id, name: user.name, email: user.email, phone : user.phone, createdAt: user.createdAt, job : user.job };

      // Cria token JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set cookie com token
      res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', secure: false });

      // Redireciona para /userScene
      
      setTimeout(() => {
        res.redirect('/userScene');
      }, 2000);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const user = await userService.login(req.body);

      const payload = { id: user.id, name: user.name, email: user.email, phone : user.phone, createdAt: user.createdAt, job : user.job }; 

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
            const payload = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, phone : updatedUser.phone, createdAt: updatedUser.createdAt, job : updatedUser.job };
            const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'Lax', secure: false });
            res.redirect('/userScene');
            // Redireciona para a página do perfil do usuário
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

