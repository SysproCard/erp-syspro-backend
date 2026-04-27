const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

// ===== ROTAS DE MENUS =====

// GET - Listar todos os menus
router.get('/', menuController.listarTodos);

// GET - Obter um menu por ID
router.get('/:id', menuController.obterPorId);

// GET - Obter menus de um nível (com permissões)
router.get('/nivel/:nivelId', menuController.obterPorNivel);

// GET - Obter permissões de um menu em um nível
router.get('/:menuId/permissoes/:nivelId', menuController.obterPermissoes);

// POST - Criar um novo menu (APENAS ADMIN)
router.post('/', menuController.criar);

// PUT - Atualizar um menu (APENAS ADMIN)
router.put('/:id', menuController.atualizar);

// PUT - Atribuir permissões de menu a um nível (APENAS ADMIN)
router.put('/:menuId/permissoes/:nivelId', menuController.atribuirPermissoes);

// DELETE - Deletar um menu (APENAS ADMIN)
router.delete('/:id', menuController.deletar);

// DELETE - Remover permissões de menu de um nível (APENAS ADMIN)
router.delete('/:menuId/permissoes/:nivelId', menuController.removerPermissoes);

module.exports = router;
