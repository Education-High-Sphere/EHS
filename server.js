import express from 'express';
import userRoutes from './api/routes/userRoutes.js';

const app = express();

// configurando views
app.set('view engine', 'ejs');
app.set('views', './views');

//configurando o diretório público
app.use(express.static('public'));

if (!app) {
  throw new Error('Express app not created');
}

app.use(express.json());

if (!userRoutes) {
  throw new Error('User routes not found');
}

app.use('/users', userRoutes);
app.get('/', (req, res) => {
  if (!res) {
    throw new Error('Response object not found');
  }
  res.render('index', { title: 'EHSYNC' });
});
app.get('/userScene', (req, res) => {
  if (!res) {
    throw new Error('Response object not found');
  }
  res.render('userScene', { title: 'User Scene' });
});
app.get('/register', (req, res) => {
  if (!res) {
    throw new Error('Response object not found');
  }
  res.render('register', { title: 'Register' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});

