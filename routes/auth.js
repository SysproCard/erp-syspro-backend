
const express = require('express');


const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Quando fazer POST para /auth/cadastro
router.post('/cadastro', usuarioController.cadastro);


// auth/login
router.post('/login', usuarioController.login);

// Quando fazer GET para /auth/usuarios
router.get('/usuarios', usuarioController.listarTodos);

// Quando fazer GET para /auth/usuarios/:id - obter um usuário específico
router.get('/usuarios/:id', usuarioController.obterPorId);

// Quando fazer PUT para /auth/usuarios/:id - atualizar um usuário
router.put('/usuarios/:id', usuarioController.atualizar);


module.exports = router;
