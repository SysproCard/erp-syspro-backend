// Importar o modelo Nivel
const Nivel = require('../models/Nivel');

// Objeto com todos os controladores de níveis
const nivelController = {

  // Controlador para LISTAR TODOS OS NÍVEIS
  listarTodos: async (req, res) => {
    try {
      const niveis = await Nivel.obterTodos();
      
      res.status(200).json({
        sucesso: true,
        total: niveis.length,
        niveis: niveis
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar níveis'
      });
    }
  },

  // Controlador para OBTER UM NÍVEL POR ID
  obterPorId: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do nível é obrigatório'
        });
      }

      const nivel = await Nivel.obterPorId(parseInt(id));

      if (!nivel) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Nível não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        nivel: nivel
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter nível'
      });
    }
  },

  // Controlador para CRIAR UM NOVO NÍVEL (APENAS ADMIN)
  criar: async (req, res) => {
    try {
      const { nome, descricao } = req.body;

      // Validações
      if (!nome) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome do nível é obrigatório'
        });
      }

      const novoNivel = await Nivel.criar(nome, descricao);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Nível criado com sucesso!',
        nivel: novoNivel
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para ATUALIZAR UM NÍVEL (APENAS ADMIN)
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, ativo } = req.body;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do nível é obrigatório'
        });
      }

      const nivelAtualizado = await Nivel.atualizar(parseInt(id), {
        nome,
        descricao,
        ativo
      });

      if (!nivelAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Nível não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Nível atualizado com sucesso!',
        nivel: nivelAtualizado
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para DELETAR UM NÍVEL (APENAS ADMIN)
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do nível é obrigatório'
        });
      }

      await Nivel.deletar(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Nível deletado com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para OBTER NÍVEL COM SEUS MENUS E PERMISSÕES
  obterComMenus: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do nível é obrigatório'
        });
      }

      const nivel = await Nivel.obterComMenus(parseInt(id));

      res.status(200).json({
        sucesso: true,
        nivel: nivel
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
};

// Exportar o controlador
module.exports = nivelController;
