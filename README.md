#EHS - Education High Sphere

Este projeto é uma aplicação web desenvolvida com Node.js e o motor de templates EJS. Ele segue a arquitetura MVC (Model-View-Controller) para manter o código organizado e escalável.
Estrutura do Projeto

A aplicação é dividida em pastas que separam as responsabilidades do código:

    controllers/: Contém a lógica de negócios da aplicação, manipulando a requisição (req) e a resposta (res).

    routers/: Define as rotas da aplicação e direciona as requisições para os controladores apropriados.

    services/: Oferece serviços com a lógica da aplicação.

    repository/: Responsável pela camada de acesso ao banco de dados.

    views/: Armazena os arquivos EJS (.ejs), que são os templates HTML da aplicação.

##Como Rodar o Projeto

###Siga os passos abaixo para ter o projeto rodando em sua máquina local.
1. Clonar o Repositório

Primeiro, clone o repositório do projeto para a sua máquina usando o Git:

git clone [https://github.com/Education-High-Sphere/EHS.git](https://github.com/Education-High-Sphere/EHS.git)

2. Instalar as Dependências

Navegue até o diretório do projeto e instale todas as dependências do Node.js:

cd EHS
npm install

3. Executar o Servidor

Existem duas formas principais de iniciar o servidor:
Modo de Desenvolvimento (Recomendado)

Para iniciar o servidor no modo de desenvolvimento, com reinicialização automática a cada alteração, use o seguinte comando:

npm run dev

Este é o método principal para desenvolvimento, pois ele monitora os arquivos e recarrega a aplicação instantaneamente.
Modo de Produção

Para rodar o servidor em um ambiente de produção ou para testes finais, use o comando:

node server.js

Este comando executa o script principal sem o monitoramento de arquivos.
4. Build do Projeto

Se o seu projeto precisar de uma etapa de build para processar arquivos, como minificar CSS ou JavaScript, você pode usar o seguinte comando:

npm run build

Este comando executa o script de build configurado no package.json para preparar os arquivos para implantação.

Se tiver alguma dúvida ou precisar de ajuda, sinta-se à vontade para abrir uma issue no repositório.
