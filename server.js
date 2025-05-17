// server.js - Servidor Node.js com banco SQLite

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Garante que a pasta de banco de dados existe
const dbFolder = path.join(__dirname, 'database');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

// Cria o banco de dados SQLite
const db = new sqlite3.Database(path.join(dbFolder, 'serraexplore.db'));

// Criação de tabelas
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  tipo TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS empresas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  empresa TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  telefone TEXT NOT NULL,
  emailEmpresa TEXT NOT NULL
)`);

// Rota para cadastrar usuário
app.post('/api/usuarios', (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }
  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
    [nome, email, senha, tipo],
    function (err) {
      if (err) return res.status(400).json({ erro: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Rota para cadastrar empresa
app.post('/api/empresas', (req, res) => {
  const { empresa, cnpj, tipo, descricao, telefone, emailEmpresa } = req.body;
  if (!empresa || !cnpj || !tipo || !descricao || !telefone || !emailEmpresa) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }
  db.run(
    `INSERT INTO empresas (empresa, cnpj, tipo, descricao, telefone, emailEmpresa)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empresa, cnpj, tipo, descricao, telefone, emailEmpresa],
    function (err) {
      if (err) return res.status(400).json({ erro: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// APAGAR TODOS OS USUÁRIOS
app.delete('/api/usuarios', (req, res) => {
  db.run('DELETE FROM usuarios', [], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Todos os usuários foram apagados.' });
  });
});

// APAGAR TODAS AS EMPRESAS
app.delete('/api/empresas', (req, res) => {
  db.run('DELETE FROM empresas', [], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Todas as empresas foram apagadas.' });
  });
});


// Rota de teste para obter empresas (opcional)
app.get('/api/empresas', (req, res) => {
  db.all(`SELECT * FROM empresas`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Rota para apagar todos os usuários
app.delete('/api/usuarios', (req, res) => {
  db.run('DELETE FROM usuarios', [], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Todos os usuários foram apagados.' });
  });
});

// Rota para apagar todas as empresas
app.delete('/api/empresas', (req, res) => {
  db.run('DELETE FROM empresas', [], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Todas as empresas foram apagadas.' });
  });
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
