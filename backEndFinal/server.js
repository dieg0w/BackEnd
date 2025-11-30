const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inicializar banco de dados
const caminhoBanco = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(caminhoBanco);

// Criar tabela de usuários se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario TEXT UNIQUE,
    email TEXT UNIQUE,
    cnpj TEXT UNIQUE,
    senha_hash TEXT
  )`);
});

const app = express();
const PORTA = 3000;
const CHAVE_SECRETA_JWT = 'sua_chave_secreta_jwt'; // Mude isso em produção

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Funções de validação
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarCNPJ(cnpj) {
  // Validação básica de CNPJ: 14 dígitos, pode ser formatado ou não
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return cnpjLimpo.length === 14;
}

// Middleware de autenticação
function autenticarToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  jwt.verify(token, CHAVE_SECRETA_JWT, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Rotas
app.post('/register', async (req, res) => {
  const { nome_usuario, email, cnpj, senha, confirmar_senha } = req.body;

  if (!nome_usuario || !email || !cnpj || !senha || !confirmar_senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!validarCNPJ(cnpj)) {
    return res.status(400).json({ error: 'CNPJ inválido' });
  }

  if (senha !== confirmar_senha) {
    return res.status(400).json({ error: 'Senhas não coincidem' });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    db.run(`INSERT INTO users (nome_usuario, email, cnpj, senha_hash) VALUES (?, ?, ?, ?)`,
      [nome_usuario, email, cnpj, senhaCriptografada],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Usuário, email ou CNPJ já existem' });
          }
          return res.status(500).json({ error: 'Erro no banco de dados' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.post('/login', (req, res) => {
  const { nome_usuario, senha } = req.body;

  if (!nome_usuario || !senha) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
  }

  db.get(`SELECT * FROM users WHERE nome_usuario = ?`, [nome_usuario], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, nome_usuario: user.nome_usuario }, CHAVE_SECRETA_JWT, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/users', autenticarToken, (req, res) => {
  db.all(`SELECT id, nome_usuario, email, cnpj FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    res.json(rows);
  });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
