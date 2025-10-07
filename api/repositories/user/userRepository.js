import supabase from '../../../.config/db.js';  // importa o pool do db.js

export async function findUserById(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
  return data;
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
  return data;
}

export async function createUser(userData) {
  const { name, email, passwordHash, job, birth_date } = userData;
  const { data, error } = await supabase.from('users').insert({ name, email, password: passwordHash, job, birth_date }).single();
  if (error) {
    console.error('Erro ao criar usuário:', error);
    return null;
  }
  return data;
}

export async function updateUser(id, userData) {
  const { name, email, passwordHash, job, birth_date } = userData;
  const { data, error } = await supabase.from('users').update({ name, email, password: passwordHash, job, birth_date }).eq('id', id).single();
  if (error) {
    console.error('Erro ao atualizar usuário:', error);
    return null;
  }
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    console.error('Erro ao deletar usuário:', error);
    return false;
  }
  return true;
}

export async function findAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
  return data;
}
export default {
  findById: findUserById,
  findByEmail: findUserByEmail,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  findAll: findAllUsers
};
