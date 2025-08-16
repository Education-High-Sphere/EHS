import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config('../.env'); // Carrega as variáveis de ambiente do arquivo .env

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.DB_HOST || !process.env.DB_USER  || !process.env.DB_NAME) {
  throw new Error('Variáveis de ambiente do banco de dados não estão definidas');
}

// Cria pool de conexões (melhor para múltiplas requisições)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

if (!pool) {
  throw new Error('Não foi possível criar o pool de conexões com o banco de dados');
}

export default pool;

