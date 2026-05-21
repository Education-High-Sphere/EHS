import userRepository, { updateUser } from '../../repositories/user/userRepository.js';
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
  return user;
},

  async getProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },
  async findAll() {
    return await userRepository.findAll();
  },

  async updateUser(id, data) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new Error('Usuário não encontrado');

    if (data.email && data.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(data.email);
      if (emailTaken) throw new Error('Email já registrado');
    }
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : existing.password;
    
    // Mescla dados existentes com novos dados para evitar sobrescrever com undefined
    const updatedData = {
      name: data.name || existing.name,
      email: data.email || existing.email,
      phone: data.phone || existing.phone,
      job: data.job || existing.job,
      birth_date: data.birth_date || existing.birth_date,
      avatar: data.avatar || existing.avatar,
      roles: data.roles || existing.roles,
      passwordHash
    };

    await userRepository.update(id, updatedData);

    const updatedUser = await userRepository.findById(id);
    return updatedUser;
  }

};
