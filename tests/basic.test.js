const dotenv = require('dotenv');

// Carrega variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

describe('Configuração Básica', () => {
  test('deve carregar variáveis de ambiente', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.DB_HOST).toBeDefined();
  });

  test('deve ter JWT_SECRET configurado', () => {
    expect(process.env.JWT_SECRET).toBe('test_jwt_secret_key_for_github_actions');
  });

  test('soma básica', () => {
    expect(1 + 1).toBe(2);
  });
});
