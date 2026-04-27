const express = require('express');
const nivelController = require('../controllers/nivelController');

const router = express.Router();

// ===== ROTAS DE NÍVEIS =====

// GET - Listar todos os níveis
router.get('/', nivelController.listarTodos);

// GET - Obter um nível por ID
router.get('/:id', nivelController.obterPorId);

// GET - Obter nível com seus menus e permissões
router.get('/:id/menus', nivelController.obterComMenus);

// POST - Criar um novo nível (APENAS ADMIN)
router.post('/', nivelController.criar);

// PUT - Atualizar um nível (APENAS ADMIN)
router.put('/:id', nivelController.atualizar);

// DELETE - Deletar um nível (APENAS ADMIN)
router.delete('/:id', nivelController.deletar);

module.exports = router;
