import { pool } from '../../../.config/db.js';

export async function findUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

export async function createUser(userData) {
  const { name, email, passwordHash, job, birth_date, phone } = userData;
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password, job, birth_date, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, email, passwordHash, job, birth_date, phone]
  );
  return rows[0];
}

export async function updateUser(id, userData) {
  const { name, email, passwordHash, job, birth_date, phone } = userData;
  // Note: We use COALESCE or similar if we want to merge, but here the service handles merging.
  // Actually, I'll just update all provided fields.
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3, job = $4, birth_date = $5, phone = $6 WHERE id = $7 RETURNING *',
    [name, email, passwordHash, job, birth_date, phone, id]
  );
  return rows[0];
}

export async function deleteUser(id) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function findAllUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
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
