# BackEndFinal

Este é o backend para o sistema de gerenciamento de usuários, desenvolvido com Node.js, Express e SQLite.

## Como baixar e executar

1. **Clone o repositório:**
   ```
   git clone <url-do-repositorio>
   cd backEndFinal
   ```

2. **Instale as dependências:**
   ```
   npm install
   ```

3. **Execute o servidor:**
   - Para produção:
     ```
     npm start
     ```
   - Para desenvolvimento (com nodemon):
     ```
     npm run dev
     ```

O servidor estará rodando em `http://localhost:3000`.

## Conectando com o frontend

O frontend deve fazer chamadas API para `http://localhost:3000`. Certifique-se de que o frontend esteja configurado para apontar para essa URL.

### Endpoints disponíveis:

- **POST /register**: Registrar um novo usuário.
  - Corpo: `{ "nome_usuario": "string", "email": "string", "cnpj": "string", "senha": "string", "confirmar_senha": "string" }`

- **POST /login**: Fazer login.
  - Corpo: `{ "nome_usuario": "string", "senha": "string" }`
  - Retorna: `{ "token": "jwt_token" }`

- **GET /users**: Listar usuários (requer autenticação).
  - Header: `Authorization: Bearer <token>`

Use o token JWT retornado no login para autenticação nas rotas protegidas.

## Notas

- O banco de dados SQLite (`users.db`) é criado automaticamente na primeira execução.
- Mude a `CHAVE_SECRETA_JWT` em `server.js` para produção.
