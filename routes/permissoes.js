const express = require('express');
const permissaoController = require('../controllers/permissaoController');

const router = express.Router();

// ===== ROTAS DE PERMISSÕES =====

// GET - Listar todos os módulos
router.get('/modulos', permissaoController.listarModulos);

// GET - Listar todas as permissões
router.get('/todas', permissaoController.listarPermissoes);

// GET - Obter permissões de um usuário (agrupado por módulo)
router.get('/usuario/:usuarioId', permissaoController.obterPermissoesUsuario);

// PUT - Atualizar todas as permissões de um usuário
router.put('/usuario/:usuarioId', permissaoController.atualizarPermissoes);

// POST - Adicionar uma permissão a um usuário
router.post('/usuario/:usuarioId/adicionar', permissaoController.adicionarPermissao);

// DELETE - Remover uma permissão de um usuário
router.delete('/usuario/:usuarioId/permissao/:permissaoId', permissaoController.removerPermissao);

// GET - Verificar se um usuário tem uma permissão específica (query params)
// Exemplo: /permissoes/verificar?usuarioId=1&chave=usuarios.editar
router.get('/verificar', permissaoController.verificarPermissao);

module.exports = router;
