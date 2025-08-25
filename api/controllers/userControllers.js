import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';


export default {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);

      // Cria token JWT
      const token = jwt.sign({ id: user.insertId, name: req.body.name, email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Redireciona para /userScene passando token como query (ou via cookie)
      res.redirect(`/userScene?token=${token}`);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const token = await userService.login(req.body);

      // Redireciona para /userScene com token
      res.redirect(`/userScene?token=${token}`);
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
    }
};
// api/controllers/userControllers.js
