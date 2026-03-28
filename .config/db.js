import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error('Variáveis de ambiente do banco de dados não estão definidas');
}

// Cria pool de conexões para PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões seguras com Supabase
  }
});

pool.on('connect', () => {
  console.log('Pool de conexões PostgreSQL criado com sucesso');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões PostgreSQL', err);
});

export default pool;

