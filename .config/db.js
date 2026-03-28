import pkg from 'pg';
const { Pool } = pkg;
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- Suporte para pg (Legacy) ---
let pool;
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.on('connect', () => {
    console.log('Pool de conexões PostgreSQL (pg) criado com sucesso');
  });

  pool.on('error', (err) => {
    console.error('Erro inesperado no pool de conexões PostgreSQL', err);
  });
}

// --- Suporte para Supabase Client (Modern) ---
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ROLE_KEY
  );
  if (supabase) {
    console.log('Cliente Supabase conectado com sucesso.');
  }
} else {
  console.warn('Variáveis SUPABASE_URL ou SUPABASE_ROLE_KEY não definidas.');
}

export { pool };
export default supabase;