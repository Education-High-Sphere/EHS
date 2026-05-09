import multer from 'multer';
import path from 'path';

// Configuração do armazenamento na memória (para upload no Supabase)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;