// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Classe Menu para gerenciar menus do sistema
class Menu {
  
  // Método para obter todos os menus
  static async obterTodos() {
    try {
      const result = await pool.request()
        .query(`SELECT id, titulo, rota, icon, ordem, ativo, dataCriacao 
                FROM menus WHERE ativo = 1 ORDER BY ordem, titulo`);
      
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter menus:', erro);
      return [];
    }
  }

  // Método para obter um menu por ID
  static async obterPorId(id) {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT id, titulo, rota, icon, ordem, ativo, dataCriacao 
                FROM menus WHERE id = @id`);
      
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao obter menu por ID:', erro);
      return null;
    }
  }

  // Método para obter menus de um nível específico (com permissões)
  static async obterPorNivel(nivelId) {
    try {
      const result = await pool.request()
        .input('nivelId', sql.Int, nivelId)
        .query(`
          SELECT 
            m.id,
            m.titulo,
            m.rota,
            m.icon,
            m.ordem,
            mp.pode_ver,
            mp.pode_criar,
            mp.pode_editar,
            mp.pode_deletar
          FROM menus m
          LEFT JOIN menu_permissoes mp ON m.id = mp.menuId AND mp.nivelId = @nivelId
          WHERE m.ativo = 1
          ORDER BY m.ordem, m.titulo
        `);
      
      // Formatar resultado com permissões
      return result.recordset.map(menu => ({
        id: menu.id,
        titulo: menu.titulo,
        rota: menu.rota,
        icon: menu.icon,
        ordem: menu.ordem,
        permissoes: {
          ver: menu.pode_ver === 1,
          criar: menu.pode_criar === 1,
          editar: menu.pode_editar === 1,
          deletar: menu.pode_deletar === 1
        }
      }));

    } catch (erro) {
      console.error('Erro ao obter menus por nível:', erro);
      return [];
    }
  }

  // Método para criar um novo menu (APENAS ADMIN)
  static async criar(titulo, rota, icon, ordem = 0) {
    try {
      // Validar campos obrigatórios
      if (!titulo) {
        throw new Error('Título do menu é obrigatório');
      }

      // Executar a query INSERT para criar novo menu
      const result = await pool.request()
        .input('titulo', sql.VarChar, titulo)
        .input('rota', sql.VarChar, rota || null)
        .input('icon', sql.VarChar, icon || null)
        .input('ordem', sql.Int, ordem)
        .query(`INSERT INTO menus (titulo, rota, icon, ordem, ativo, dataCriacao) 
                VALUES (@titulo, @rota, @icon, @ordem, 1, GETDATE()); 
                SELECT SCOPE_IDENTITY() as id`);
      
      // Obter o ID do novo menu
      const novoId = result.recordset[0].id;
      
      // Retornar o menu criado
      const novoMenu = await this.obterPorId(novoId);
      return novoMenu;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para atualizar um menu (APENAS ADMIN)
  static async atualizar(id, dadosMenu) {
    try {
      const { titulo, rota, icon, ordem, ativo } = dadosMenu;

      let setClauses = [];
      const request = pool.request().input('id', sql.Int, id);

      if (titulo !== undefined) {
        setClauses.push('titulo = @titulo');
        request.input('titulo', sql.VarChar, titulo);
      }
      if (rota !== undefined) {
        setClauses.push('rota = @rota');
        request.input('rota', sql.VarChar, rota || null);
      }
      if (icon !== undefined) {
        setClauses.push('icon = @icon');
        request.input('icon', sql.VarChar, icon || null);
      }
      if (ordem !== undefined) {
        setClauses.push('ordem = @ordem');
        request.input('ordem', sql.Int, ordem);
      }
      if (ativo !== undefined) {
        setClauses.push('ativo = @ativo');
        request.input('ativo', sql.Bit, ativo ? 1 : 0);
      }

      if (setClauses.length === 0) {
        throw new Error('Nenhum campo foi fornecido para atualização');
      }

      const query = `UPDATE menus SET ${setClauses.join(', ')} WHERE id = @id`;
      await request.query(query);

      // Retornar o menu atualizado
      const menuAtualizado = await this.obterPorId(id);
      return menuAtualizado;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para deletar um menu (APENAS ADMIN)
  static async deletar(id) {
    try {
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM menus WHERE id = @id');

      return true;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para atribuir permissões de um menu a um nível
  static async atribuirPermissoes(menuId, nivelId, permissoes) {
    try {
      const { pode_ver, pode_criar, pode_editar, pode_deletar } = permissoes;

      // Verificar se já existe permissão para este menu/nível
      const existente = await pool.request()
        .input('menuId', sql.Int, menuId)
        .input('nivelId', sql.Int, nivelId)
        .query(`SELECT id FROM menu_permissoes 
                WHERE menuId = @menuId AND nivelId = @nivelId`);

      if (existente.recordset.length > 0) {
        // Atualizar permissão existente
        await pool.request()
          .input('menuId', sql.Int, menuId)
          .input('nivelId', sql.Int, nivelId)
          .input('pode_ver', sql.Bit, pode_ver ? 1 : 0)
          .input('pode_criar', sql.Bit, pode_criar ? 1 : 0)
          .input('pode_editar', sql.Bit, pode_editar ? 1 : 0)
          .input('pode_deletar', sql.Bit, pode_deletar ? 1 : 0)
          .query(`UPDATE menu_permissoes 
                  SET pode_ver = @pode_ver, pode_criar = @pode_criar, 
                      pode_editar = @pode_editar, pode_deletar = @pode_deletar
                  WHERE menuId = @menuId AND nivelId = @nivelId`);
      } else {
        // Inserir nova permissão
        await pool.request()
          .input('menuId', sql.Int, menuId)
          .input('nivelId', sql.Int, nivelId)
          .input('pode_ver', sql.Bit, pode_ver ? 1 : 0)
          .input('pode_criar', sql.Bit, pode_criar ? 1 : 0)
          .input('pode_editar', sql.Bit, pode_editar ? 1 : 0)
          .input('pode_deletar', sql.Bit, pode_deletar ? 1 : 0)
          .query(`INSERT INTO menu_permissoes (menuId, nivelId, pode_ver, pode_criar, pode_editar, pode_deletar, dataCriacao)
                  VALUES (@menuId, @nivelId, @pode_ver, @pode_criar, @pode_editar, @pode_deletar, GETDATE())`);
      }

      return true;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para remover permissões de um menu a um nível
  static async removerPermissoes(menuId, nivelId) {
    try {
      await pool.request()
        .input('menuId', sql.Int, menuId)
        .input('nivelId', sql.Int, nivelId)
        .query(`DELETE FROM menu_permissoes 
                WHERE menuId = @menuId AND nivelId = @nivelId`);

      return true;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para obter permissões de um menu por nível
  static async obterPermissoes(menuId, nivelId) {
    try {
      const result = await pool.request()
        .input('menuId', sql.Int, menuId)
        .input('nivelId', sql.Int, nivelId)
        .query(`SELECT pode_ver, pode_criar, pode_editar, pode_deletar 
                FROM menu_permissoes 
                WHERE menuId = @menuId AND nivelId = @nivelId`);

      if (result.recordset.length > 0) {
        return {
          ver: result.recordset[0].pode_ver === 1,
          criar: result.recordset[0].pode_criar === 1,
          editar: result.recordset[0].pode_editar === 1,
          deletar: result.recordset[0].pode_deletar === 1
        };
      }

      return {
        ver: false,
        criar: false,
        editar: false,
        deletar: false
      };

    } catch (erro) {
      console.error('Erro ao obter permissões do menu:', erro);
      return null;
    }
  }
}

// Exportar a classe para ser usada em outros arquivos
module.exports = Menu;
