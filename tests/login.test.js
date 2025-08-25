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
  
  // Objetivo: Verificar se o sistema permite login com credenciais corretas
  // Cenário: Usuário envia email e senha válidos
  // Resultado esperado: Status 200 + token JWT retornado
  test('deve fazer login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',  // Email válido (hardcoded no sistema)
        password: '123456'          // Senha válida (hardcoded no sistema)
      })
      .expect(200);                 // Espera status HTTP 200 (sucesso)

    expect(response.body).toHaveProperty('token');  // Verifica se retorna um token
    expect(response.body.token).toBeDefined();      // Verifica se o token não é undefined
  });

  // Login sem Dados
  // Objetivo: Verificar se o sistema rejeita tentativas de login vazias
  // Cenário: Usuário não envia email nem senha
  // Resultado esperado: Status 401 + mensagem de erro
  test('deve rejeitar login sem dados', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({})                     // Envia objeto vazio (sem email/senha)
      .expect(401);                 // Espera status HTTP 401 (não autorizado)

    expect(response.body).toHaveProperty('error');  // Verifica se retorna mensagem de erro
  });

  // Login com Senha Incorreta
  // Objetivo: Verificar se o sistema rejeita senhas incorretas
  // Cenário: Usuário envia email correto mas senha errada
  // Resultado esperado: Status 401 + mensagem de erro
  test('deve rejeitar senha incorreta', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',  // Email correto
        password: 'senhaerrada'     // Senha incorreta
      })
      .expect(401);                 // Espera status HTTP 401 (não autorizado)

    expect(response.body).toHaveProperty('error');  // Verifica se retorna mensagem de erro
  });

  // Registro de Usuário
  // Objetivo: Verificar se o sistema permite registrar novos usuários
  // Cenário: Usuário envia todos os dados obrigatórios (name, email, password)
  // Resultado esperado: Status 201 + mensagem de sucesso
  test('deve registrar novo usuário', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: 'João',               // Nome do usuário
        email: 'joao@teste.com',    // Email do usuário
        password: '123456'          // Senha do usuário
      })
      .expect(201);                 // Espera status HTTP 201 (criado)

    expect(response.body).toHaveProperty('message');  // Verifica se retorna mensagem de sucesso
  });

  // Validação do Token JWT
  // Objetivo: Verificar se o token JWT gerado é válido e contém dados corretos
  // Cenário: Usuário faz login com sucesso e recebe um token
  // Resultado esperado: Token pode ser decodificado e contém id e email
  test('deve criar token JWT válido', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: '123456'
      });

    const token = response.body.token;                           // Extrai o token da resposta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   // Decodifica o token usando a chave secreta
    
    expect(decoded).toHaveProperty('id');                        // Verifica se o token contém ID do usuário
    expect(decoded).toHaveProperty('email', 'test@example.com'); // Verifica se o token contém o email correto
  });
});