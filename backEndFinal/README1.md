# Sistema de Gerenciamento de Usuários

Este é um sistema web completo com front-end e back-end para gerenciamento de usuários, incluindo cadastro, login e listagem de usuários.

## Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- NPM (geralmente vem com Node.js)

## Como Baixar e Executar

1. **Clone ou baixe o repositório:**
   - Se você tem Git: `git clone <url-do-repositorio>`
   - Ou baixe o ZIP e extraia.

2. **Instale as dependências do back-end:**
   - Abra o terminal na pasta `backend`
   - Execute: `npm install`

3. **Execute o servidor:**
   - Na pasta `backend`, execute: `npm start`
   - O servidor estará rodando em `http://localhost:3000`

4. **Abra o front-end:**
   - Abra `frontend/register.html` no navegador para começar.

## Funcionalidades

- **Cadastro:** Formulário com validação de email, CNPJ (14 dígitos), senha e confirmação.
- **Login:** Autenticação com nome de usuário e senha, geração de token JWT.
- **Admin:** Listagem de todos os usuários cadastrados (protegida por autenticação).

## Estrutura do Projeto

- `backend/`: Código do servidor Node.js/Express
- `frontend/`: Páginas HTML, CSS e JavaScript

## Tecnologias Utilizadas

- Back-end: Node.js, Express, SQLite, bcryptjs, jsonwebtoken
- Front-end: HTML, CSS, JavaScript

## Validações

- Email: Deve ser um email válido.
- CNPJ: Deve ter 14 dígitos numéricos.
- Senha: Deve coincidir com a confirmação.

## Segurança

- Senhas criptografadas com bcrypt.
- Autenticação via JWT.
- Middleware de proteção para rotas administrativas.

## Como Testar

1. Abra `frontend/register.html` e cadastre um usuário.
2. Faça login em `frontend/login.html`.
3. Acesse `frontend/admin.html` para ver a lista de usuários.
