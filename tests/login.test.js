const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(401).json({ error: 'Email e senha obrigatórios' });
  }

  if (email === 'test@example.com' && password === '123456') {
    const token = jwt.sign({ id: 1, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }
  
  res.status(401).json({ error: 'Credenciais inválidas' });
});

app.post('/users/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Dados obrigatórios' });
  }
  
  res.status(201).json({ message: 'Usuário criado' });
});

describe('Testes de Login Simples', () => {
  
  test('deve fazer login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: '123456'
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeDefined();
  });

  test('deve rejeitar login sem dados', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({})
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  test('deve rejeitar senha incorreta', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'senhaerrada'
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  test('deve registrar novo usuário', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'João',
        email: 'joao@teste.com',
        password: '123456'
      })
      .expect(201);

    expect(response.body).toHaveProperty('message');
  });

  test('deve criar token JWT válido', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    const token = response.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('email', 'test@example.com');
  });
});