import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Verifica se as novas variáveis de ambiente do Supabase estão definidas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ROLE_KEY) {
  throw new Error('As variáveis SUPABASE_URL e SUPABASE_ROLE_KEY precisam estar definidas no arquivo .env');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

if (!supabase) {
  throw new Error('Não foi possível criar o cliente Supabase.');
} else {
  console.log('Cliente Supabase conectado com sucesso.');
}

// Exporta o cliente Supabase para ser usado em outras partes do seu código
export default supabase;