import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (!data.name || !data.email || !data.password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }
    if (existing) throw new Error('Email já registrado');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({ ...data, passwordHash: passwordHash });
    return user;
  },

  async login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('Usuário não encontrado');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Senha inválida');

  // Cria token incluindo name, email e id
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
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
