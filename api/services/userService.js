import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error('Email já registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({ ...data, password: hashedPassword });
    return user;
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Senha inválida');

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  },

  async getProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },
  async findAll() {
    return await userRepository.findAll();
  }

};
