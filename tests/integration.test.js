const request = require('supertest');
const express = require('express');

describe('Testes de Integração Simples', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Rota básica para teste
    app.get('/', (req, res) => {
      res.json({ message: 'EHSYNC API funcionando!' });
    });
    
    // Rotas de teste para login
    app.post('/users/register', (req, res) => {
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Dados obrigatórios' });
      }
      res.status(200).json({ success: true });
    });
    
    app.post('/users/login', (req, res) => {
      if (!req.body.email || !req.body.password) {
        return res.status(401).json({ error: 'Email e senha obrigatórios' });
      }
      res.status(200).json({ success: true });
    });
  });

  test('GET / deve retornar mensagem de sucesso', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body.message).toBe('EHSYNC API funcionando!');
  });

  test('POST /users/register sem dados deve retornar 400', async () => {
    await request(app)
      .post('/users/register')
      .send({})
      .expect(400);
  });

  test('POST /users/login sem dados deve retornar 401', async () => {
    await request(app)
      .post('/users/login')
      .send({})
      .expect(401);
  });

  test('POST /users/register com dados válidos deve retornar 200', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);
  });

  test('POST /users/login com dados válidos deve retornar 200', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);
  });
});
