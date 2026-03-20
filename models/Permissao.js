// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Classe Permissao para gerenciar permissões de usuários
class Permissao {
  
  // Método para obter todos os módulos do sistema
  static async obterModulos() {
    try {
      const result = await pool.request()
        .query(`SELECT id, nome, descricao, ativo FROM modulos WHERE ativo = 1 ORDER BY nome`);
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter módulos:', erro);
      return [];
    }
  }

  // Método para obter todas as permissões
  static async obterTodas() {
    try {
      const result = await pool.request()
        .query(`SELECT p.id, p.moduloId, m.nome as moduloNome, p.nome, p.descricao, p.chave, p.ativo
                FROM permissoes p
                LEFT JOIN modulos m ON p.moduloId = m.id
                WHERE p.ativo = 1
                ORDER BY m.nome, p.nome`);
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter permissões:', erro);
      return [];
    }
  }

  // Método para obter permissões de um usuário específico
  static async obterPorUsuario(usuarioId) {
    try {
      const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .query(`SELECT p.id, p.moduloId, m.nome as moduloNome, p.nome, p.descricao, p.chave
                FROM usuario_permissoes up
                INNER JOIN permissoes p ON up.permissaoId = p.id
                LEFT JOIN modulos m ON p.moduloId = m.id
                WHERE up.usuarioId = @usuarioId AND p.ativo = 1
                ORDER BY m.nome, p.nome`);
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter permissões do usuário:', erro);
      return [];
    }
  }

  // Método para obter permissões agrupadas por módulo
  static async obterPorUsuarioAgrupado(usuarioId) {
    try {
      const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .query(`SELECT 
                  m.id as moduloId,
                  m.nome as moduloNome,
                  m.descricao as moduloDescricao,
                  p.id as permissaoId,
                  p.nome as permissaoNome,
                  p.descricao as permissaoDescricao,
                  p.chave,
                  CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as temPermissao
                FROM modulos m
                LEFT JOIN permissoes p ON m.id = p.moduloId AND p.ativo = 1
                LEFT JOIN usuario_permissoes up ON p.id = up.permissaoId AND up.usuarioId = @usuarioId
                WHERE m.ativo = 1
                ORDER BY m.nome, p.nome`);
      
      // Agrupar resultado por módulo
      const permissoes = {};
      result.recordset.forEach(row => {
        if (!permissoes[row.moduloId]) {
          permissoes[row.moduloId] = {
            id: row.moduloId,
            nome: row.moduloNome,
            descricao: row.moduloDescricao,
            permissoes: []
          };
        }
        
        if (row.permissaoId) {
          permissoes[row.moduloId].permissoes.push({
            id: row.permissaoId,
            nome: row.permissaoNome,
            descricao: row.permissaoDescricao,
            chave: row.chave,
            ativa: row.temPermissao === 1
          });
        }
      });
      
      return Object.values(permissoes);
    } catch (erro) {
      console.error('Erro ao obter permissões agrupadas:', erro);
      return [];
    }
  }

  // Método para atualizar permissões de um usuário
  static async atualizarPermissoes(usuarioId, permissaoIds) {
    try {
      // Iniciar transação
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      
      try {
        // Deletar todas as permissões atuais do usuário
        await transaction.request()
          .input('usuarioId', sql.Int, usuarioId)
          .query('DELETE FROM usuario_permissoes WHERE usuarioId = @usuarioId');
        
        // Inserir as novas permissões
        if (permissaoIds && permissaoIds.length > 0) {
          for (const permissaoId of permissaoIds) {
            await transaction.request()
              .input('usuarioId', sql.Int, usuarioId)
              .input('permissaoId', sql.Int, permissaoId)
              .query(`INSERT INTO usuario_permissoes (usuarioId, permissaoId)
                      VALUES (@usuarioId, @permissaoId)`);
          }
        }
        
        // Confirmar transação
        await transaction.commit();
        return true;
      } catch (erro) {
        // Reverter transação em caso de erro
        await transaction.rollback();
        throw erro;
      }
    } catch (erro) {
      console.error('Erro ao atualizar permissões:', erro);
      throw erro;
    }
  }

  // Método para verificar se um usuário tem uma permissão específica
  static async temPermissao(usuarioId, chavePermissao) {
    try {
      const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .input('chave', sql.VarChar, chavePermissao)
        .query(`SELECT COUNT(*) as total FROM usuario_permissoes up
                INNER JOIN permissoes p ON up.permissaoId = p.id
                WHERE up.usuarioId = @usuarioId AND p.chave = @chave AND p.ativo = 1`);
      
      return result.recordset[0].total > 0;
    } catch (erro) {
      console.error('Erro ao verificar permissão:', erro);
      return false;
    }
  }

  // Método para adicionar uma permissão a um usuário
  static async adicionarPermissao(usuarioId, permissaoId) {
    try {
      const result = await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .input('permissaoId', sql.Int, permissaoId)
        .query(`INSERT INTO usuario_permissoes (usuarioId, permissaoId)
                VALUES (@usuarioId, @permissaoId)`);
      return true;
    } catch (erro) {
      // Se for erro de unique constraint, permissão já existe
      if (erro.number === 2627) {
        return true;
      }
      console.error('Erro ao adicionar permissão:', erro);
      throw erro;
    }
  }

  // Método para remover uma permissão de um usuário
  static async removerPermissao(usuarioId, permissaoId) {
    try {
      await pool.request()
        .input('usuarioId', sql.Int, usuarioId)
        .input('permissaoId', sql.Int, permissaoId)
        .query(`DELETE FROM usuario_permissoes 
                WHERE usuarioId = @usuarioId AND permissaoId = @permissaoId`);
      return true;
    } catch (erro) {
      console.error('Erro ao remover permissão:', erro);
      throw erro;
    }
  }
}

// Exportar a classe para ser usada em outros arquivos
module.exports = Permissao;
