// Importar o modelo Permissao
const Permissao = require('../models/Permissao');

// Objeto com todos os controladores de permissões
const permissaoController = {

  // Controlador para LISTAR TODOS OS MÓDULOS
  listarModulos: async (req, res) => {
    try {
      const modulos = await Permissao.obterModulos();
      
      res.status(200).json({
        sucesso: true,
        total: modulos.length,
        modulos: modulos
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar módulos'
      });
    }
  },

  // Controlador para LISTAR TODAS AS PERMISSÕES
  listarPermissoes: async (req, res) => {
    try {
      const permissoes = await Permissao.obterTodas();
      
      res.status(200).json({
        sucesso: true,
        total: permissoes.length,
        permissoes: permissoes
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar permissões'
      });
    }
  },

  // Controlador para OBTER PERMISSÕES DE UM USUÁRIO (agrupado por módulo)
  obterPermissoesUsuario: async (req, res) => {
    try {
      const { usuarioId } = req.params;

      if (!usuarioId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      const permissoes = await Permissao.obterPorUsuarioAgrupado(usuarioId);

      res.status(200).json({
        sucesso: true,
        usuarioId: parseInt(usuarioId),
        modulos: permissoes
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter permissões do usuário'
      });
    }
  },

  // Controlador para ATUALIZAR PERMISSÕES DE UM USUÁRIO
  atualizarPermissoes: async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { permissoes } = req.body;

      if (!usuarioId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      if (!Array.isArray(permissoes)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Permissões deve ser um array de IDs'
        });
      }

      // Atualizar permissões
      await Permissao.atualizarPermissoes(usuarioId, permissoes);

      // Obter as permissões atualizadas
      const permissoesAtualizadas = await Permissao.obterPorUsuarioAgrupado(usuarioId);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Permissões atualizadas com sucesso!',
        usuarioId: parseInt(usuarioId),
        modulos: permissoesAtualizadas
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para ADICIONAR UMA PERMISSÃO
  adicionarPermissao: async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { permissaoId } = req.body;

      if (!usuarioId || !permissaoId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário e ID da permissão são obrigatórios'
        });
      }

      await Permissao.adicionarPermissao(parseInt(usuarioId), permissaoId);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Permissão adicionada com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para REMOVER UMA PERMISSÃO
  removerPermissao: async (req, res) => {
    try {
      const { usuarioId, permissaoId } = req.params;

      if (!usuarioId || !permissaoId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário e ID da permissão são obrigatórios'
        });
      }

      await Permissao.removerPermissao(parseInt(usuarioId), parseInt(permissaoId));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Permissão removida com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para VERIFICAR UMA PERMISSÃO ESPECÍFICA
  verificarPermissao: async (req, res) => {
    try {
      const { usuarioId, chave } = req.query;

      if (!usuarioId || !chave) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'usuarioId e chave da permissão são obrigatórios'
        });
      }

      const temPermissao = await Permissao.temPermissao(parseInt(usuarioId), chave);

      res.status(200).json({
        sucesso: true,
        usuarioId: parseInt(usuarioId),
        chave: chave,
        temPermissao: temPermissao
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao verificar permissão'
      });
    }
  }
};

// Exportar o objeto com todos os controladores
module.exports = permissaoController;
