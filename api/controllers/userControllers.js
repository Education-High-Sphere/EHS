import userService from '../services/userService.js';


export default {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const token = await userService.login(req.body);
      res.json({ token });
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
