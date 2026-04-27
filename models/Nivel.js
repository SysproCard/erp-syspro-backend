// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Classe Nivel para gerenciar os níveis operacionais dos usuários
class Nivel {
  
  // Método para obter todos os níveis
  static async obterTodos() {
    try {
      const result = await pool.request()
        .query(`SELECT id, nome, descricao, ativo, dataCriacao FROM niveis ORDER BY id`);
      
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter níveis:', erro);
      return [];
    }
  }

  // Método para obter um nível por ID
  static async obterPorId(id) {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT id, nome, descricao, ativo, dataCriacao FROM niveis WHERE id = @id`);
      
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao obter nível por ID:', erro);
      return null;
    }
  }

  // Método para obter um nível por nome
  static async obterPorNome(nome) {
    try {
      const result = await pool.request()
        .input('nome', sql.VarChar, nome)
        .query(`SELECT id, nome, descricao, ativo, dataCriacao FROM niveis WHERE nome = @nome`);
      
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao obter nível por nome:', erro);
      return null;
    }
  }

  // Método para criar um novo nível (APENAS ADMIN)
  static async criar(nomeNivel, descricao) {
    try {
      // Validar campos obrigatórios
      if (!nomeNivel) {
        throw new Error('Nome do nível é obrigatório');
      }

      // Verificar se já existe um nível com este nome
      const nivelExistente = await this.obterPorNome(nomeNivel);
      if (nivelExistente) {
        throw new Error('Nível com este nome já existe');
      }

      // Executar a query INSERT para criar novo nível
      const result = await pool.request()
        .input('nome', sql.VarChar, nomeNivel)
        .input('descricao', sql.VarChar, descricao || null)
        .query(`INSERT INTO niveis (nome, descricao, ativo, dataCriacao) 
                VALUES (@nome, @descricao, 1, GETDATE()); 
                SELECT SCOPE_IDENTITY() as id`);
      
      // Obter o ID do novo nível
      const novoId = result.recordset[0].id;
      
      // Retornar o nível criado
      const novoNivel = await this.obterPorId(novoId);
      return novoNivel;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para atualizar um nível (APENAS ADMIN)
  static async atualizar(id, dadosNivel) {
    try {
      const { nome, descricao, ativo } = dadosNivel;

      // Validar que pelo menos um campo foi fornecido
      let setClauses = [];
      const request = pool.request().input('id', sql.Int, id);

      if (nome !== undefined) {
        setClauses.push('nome = @nome');
        request.input('nome', sql.VarChar, nome);
      }
      if (descricao !== undefined) {
        setClauses.push('descricao = @descricao');
        request.input('descricao', sql.VarChar, descricao || null);
      }
      if (ativo !== undefined) {
        setClauses.push('ativo = @ativo');
        request.input('ativo', sql.Bit, ativo ? 1 : 0);
      }

      if (setClauses.length === 0) {
        throw new Error('Nenhum campo foi fornecido para atualização');
      }

      const query = `UPDATE niveis SET ${setClauses.join(', ')} WHERE id = @id`;
      await request.query(query);

      // Retornar o nível atualizado
      const nivelAtualizado = await this.obterPorId(id);
      return nivelAtualizado;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para deletar um nível (APENAS ADMIN)
  static async deletar(id) {
    try {
      // Verificar se há usuários associados a este nível
      const usuariosComNivel = await pool.request()
        .input('nivelId', sql.Int, id)
        .query('SELECT COUNT(*) as total FROM usuarios WHERE nivelId = @nivelId');

      if (usuariosComNivel.recordset[0].total > 0) {
        throw new Error('Não é possível deletar um nível que possui usuários associados');
      }

      // Deletar o nível
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM niveis WHERE id = @id');

      return true;

    } catch (erro) {
      throw erro;
    }
  }

  // Método para obter todos os niveis com seus menus e permissões
  static async obterComMenus(nivelId) {
    try {
      const result = await pool.request()
        .input('nivelId', sql.Int, nivelId)
        .query(`
          SELECT 
            n.id as nivelId,
            n.nome as nivelNome,
            n.descricao as nivelDescricao,
            m.id as menuId,
            m.titulo as menuTitulo,
            m.rota,
            m.icon,
            m.ordem,
            mp.pode_ver,
            mp.pode_criar,
            mp.pode_editar,
            mp.pode_deletar
          FROM niveis n
          LEFT JOIN menu_permissoes mp ON n.id = mp.nivelId
          LEFT JOIN menus m ON mp.menuId = m.id
          WHERE n.id = @nivelId AND n.ativo = 1
          ORDER BY m.ordem
        `);

      // Agrupar menus por nível
      const nivel = {
        id: nivelId,
        nome: null,
        descricao: null,
        menus: []
      };

      if (result.recordset.length > 0) {
        nivel.nome = result.recordset[0].nivelNome;
        nivel.descricao = result.recordset[0].nivelDescricao;

        result.recordset.forEach(row => {
          if (row.menuId) {
            nivel.menus.push({
              id: row.menuId,
              titulo: row.menuTitulo,
              rota: row.rota,
              icon: row.icon,
              ordem: row.ordem,
              permissoes: {
                ver: row.pode_ver === 1,
                criar: row.pode_criar === 1,
                editar: row.pode_editar === 1,
                deletar: row.pode_deletar === 1
              }
            });
          }
        });
      }

      return nivel;

    } catch (erro) {
      console.error('Erro ao obter nível com menus:', erro);
      throw erro;
    }
  }
}

// Exportar a classe para ser usada em outros arquivos
module.exports = Nivel;
