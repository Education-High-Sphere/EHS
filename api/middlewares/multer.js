import multer from 'multer';
import path from 'path';

// Configuração do armazenamento com multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/'); // Diretório onde os arquivos serão salvos
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export default upload;