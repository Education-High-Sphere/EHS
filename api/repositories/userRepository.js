import pool from '../../.config/db.js';  // importa o pool do db.js

export async function findUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0]; // retorna o usuário ou undefined se não existir
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function createUser(userData) {
  const { name, email, passwordHash, job, birth_date } = userData;
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, job, birth_date) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, job, birth_date]
  );
  return result.insertId;
}

export async function updateUser(id, userData) {
  const { name, email, passwordHash, job, birth_date } = userData;
  await pool.query(
    'UPDATE users SET name = ?, email = ?, password = ?, job = ?, birth_date = ? WHERE id = ?',
    [name, email, passwordHash, job, birth_date, id]
  );
  return true;
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return true;
}

export async function findAllUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}
export default {
  findById: findUserById,
  findByEmail: findUserByEmail,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  findAll: findAllUsers
};
