// Importar o modelo Menu
const Menu = require('../models/Menu');

// Objeto com todos os controladores de menus
const menuController = {

  // Controlador para LISTAR TODOS OS MENUS
  listarTodos: async (req, res) => {
    try {
      const menus = await Menu.obterTodos();
      
      res.status(200).json({
        sucesso: true,
        total: menus.length,
        menus: menus
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar menus'
      });
    }
  },

  // Controlador para OBTER UM MENU POR ID
  obterPorId: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu é obrigatório'
        });
      }

      const menu = await Menu.obterPorId(parseInt(id));

      if (!menu) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Menu não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        menu: menu
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter menu'
      });
    }
  },

  // Controlador para OBTER MENUS DE UM NÍVEL (COM PERMISSÕES)
  obterPorNivel: async (req, res) => {
    try {
      const { nivelId } = req.params;

      if (!nivelId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do nível é obrigatório'
        });
      }

      const menus = await Menu.obterPorNivel(parseInt(nivelId));

      res.status(200).json({
        sucesso: true,
        total: menus.length,
        menus: menus
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter menus do nível'
      });
    }
  },

  // Controlador para CRIAR UM NOVO MENU (APENAS ADMIN)
  criar: async (req, res) => {
    try {
      const { titulo, rota, icon, ordem } = req.body;

      if (!titulo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Título do menu é obrigatório'
        });
      }

      const novoMenu = await Menu.criar(titulo, rota, icon, ordem);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Menu criado com sucesso!',
        menu: novoMenu
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para ATUALIZAR UM MENU (APENAS ADMIN)
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, rota, icon, ordem, ativo } = req.body;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu é obrigatório'
        });
      }

      const menuAtualizado = await Menu.atualizar(parseInt(id), {
        titulo,
        rota,
        icon,
        ordem,
        ativo
      });

      if (!menuAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Menu não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Menu atualizado com sucesso!',
        menu: menuAtualizado
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para DELETAR UM MENU (APENAS ADMIN)
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu é obrigatório'
        });
      }

      await Menu.deletar(parseInt(id));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Menu deletado com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para ATRIBUIR PERMISSÕES DE MENU A UM NÍVEL (APENAS ADMIN)
  atribuirPermissoes: async (req, res) => {
    try {
      const { menuId, nivelId } = req.params;
      const { pode_ver, pode_criar, pode_editar, pode_deletar } = req.body;

      if (!menuId || !nivelId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu e nível são obrigatórios'
        });
      }

      await Menu.atribuirPermissoes(parseInt(menuId), parseInt(nivelId), {
        pode_ver,
        pode_criar,
        pode_editar,
        pode_deletar
      });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Permissões atribuídas com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para REMOVER PERMISSÕES DE MENU DE UM NÍVEL (APENAS ADMIN)
  removerPermissoes: async (req, res) => {
    try {
      const { menuId, nivelId } = req.params;

      if (!menuId || !nivelId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu e nível são obrigatórios'
        });
      }

      await Menu.removerPermissoes(parseInt(menuId), parseInt(nivelId));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Permissões removidas com sucesso!'
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para OBTER PERMISSÕES DE UM MENU EM UM NÍVEL
  obterPermissoes: async (req, res) => {
    try {
      const { menuId, nivelId } = req.params;

      if (!menuId || !nivelId) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do menu e nível são obrigatórios'
        });
      }

      const permissoes = await Menu.obterPermissoes(parseInt(menuId), parseInt(nivelId));

      res.status(200).json({
        sucesso: true,
        permissoes: permissoes
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter permissões'
      });
    }
  }
};

// Exportar o controlador
module.exports = menuController;
