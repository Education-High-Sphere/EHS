const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Configuração básica do app para teste (sem as rotas completas por enquanto)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock básico das rotas para teste
app.post('/users/register', (req, res) => {
  // Mock simples para teste
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  // Simula criação do token
  const token = jwt.sign({ id: 1, name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`/userScene?token=${token}`);
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(401).json({ error: 'Email e senha são obrigatórios' });
  }
  
  // Mock simples: aceita test@example.com com testpassword123
  if (email === 'test@example.com' && password === 'testpassword123') {
    const token = jwt.sign({ id: 1, name: 'Test User', email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/userScene?token=${token}`);
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

describe('Login Functionality', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123'
  };

  beforeAll(async () => {
    // Aqui você pode configurar o banco de dados de teste
    // e criar um usuário de teste se necessário
  });

  afterAll(async () => {
    // Limpar dados de teste após os testes
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/users/register')
        .send(testUser)
        .expect(302); // Expecting redirect

      // Verifica se o redirecionamento contém um token
      expect(response.headers.location).toMatch(/\/userScene\?token=.+/);
    });

    it('should not register user with invalid email', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/users/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should not register user with missing fields', async () => {
      const incompleteUser = {
        name: 'Test User'
        // missing email and password
      };

      const response = await request(app)
        .post('/users/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      // Registra um usuário antes de cada teste de login
      await request(app)
        .post('/users/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await request(app)
        .post('/users/login')
        .send(loginData)
        .expect(302); // Expecting redirect

      // Verifica se o redirecionamento contém um token
      expect(response.headers.location).toMatch(/\/userScene\?token=.+/);
      
      // Extrai o token da URL de redirecionamento
      const tokenMatch = response.headers.location.match(/token=([^&]+)/);
      expect(tokenMatch).toBeTruthy();
      
      if (tokenMatch) {
        const token = tokenMatch[1];
        
        // Verifica se o token é válido
        expect(() => {
          jwt.verify(token, process.env.JWT_SECRET);
        }).not.toThrow();
      }
    });

    it('should not login with invalid email', async () => {
      const invalidLogin = {
        email: 'wrong@example.com',
        password: testUser.password
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should not login with invalid password', async () => {
      const invalidLogin = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should not login with missing credentials', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({})
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('JWT Token Validation', () => {
    it('should create a valid JWT token on successful login', async () => {
      // Primeiro registra o usuário
      await request(app)
        .post('/users/register')
        .send(testUser);

      // Depois faz login
      const response = await request(app)
        .post('/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      // Extrai o token
      const tokenMatch = response.headers.location.match(/token=([^&]+)/);
      expect(tokenMatch).toBeTruthy();
      
      if (tokenMatch) {
        const token = tokenMatch[1];
        
        // Decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verifica se contém os dados esperados
        expect(decoded).toHaveProperty('id');
        expect(decoded).toHaveProperty('email', testUser.email);
        expect(decoded).toHaveProperty('name', testUser.name);
        expect(decoded).toHaveProperty('exp'); // expiration time
      }
    });
  });
});
