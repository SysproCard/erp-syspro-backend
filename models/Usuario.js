// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Classe Usuario para gerenciar os dados dos usuários no SQL Server
class Usuario {
  
  // Método para obter todos os usuários do banco de dados
  static async obterTodos() {
    try {
      // Executar a query para buscar todos os usuários
      const result = await pool.request()
        .query(`SELECT u.id, u.nome, u.email, u.nivelId, n.nome as nivelNome, 
                u.bloqueado, u.dataCriacao, u.dataAtualizacao 
                FROM usuarios u
                LEFT JOIN niveis n ON u.nivelId = n.id`);
      
      // Retornar a lista de usuários
      return result.recordset;
    } catch (erro) {
      console.error('Erro ao obter usuários:', erro);
      return [];
    }
  }
  
  // Método para encontrar um usuário por email
  static async obterPorEmail(email) {
    try {
      // Executar a query para buscar usuário pelo email
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query(`SELECT u.id, u.nome, u.email, u.senha, u.nivelId, n.nome as nivelNome,
                u.bloqueado, u.dataCriacao, u.dataAtualizacao 
                FROM usuarios u
                LEFT JOIN niveis n ON u.nivelId = n.id
                WHERE u.email = @email`);
      
      // Retornar o primeiro usuário encontrado ou null
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao buscar usuário por email:', erro);
      return null;
    }
  }

  // Método para obter um usuário por ID
  static async obterPorId(id) {
    try {
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT u.id, u.nome, u.email, u.nivelId, n.nome as nivelNome,
                u.bloqueado, u.dataCriacao, u.dataAtualizacao 
                FROM usuarios u
                LEFT JOIN niveis n ON u.nivelId = n.id
                WHERE u.id = @id`);
      
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao obter usuário por ID:', erro);
      return null;
    }
  }
  
  // Método para criar/salvar um novo usuário
  static async criar(userData) {
    try {
      const { nome, email, senha, nivelId = 5, bloqueado = false } = userData;

      // Validar campos obrigatórios
      if (!nome || !email || !senha) {
        throw new Error('Nome, email e senha são obrigatórios');
      }

      // Validar se nivelId é válido
      if (!nivelId) {
        throw new Error('Nível é obrigatório');
      }

      // Verificar se já existe um usuário com este email
      const usuarioExistente = await this.obterPorEmail(email);
      if (usuarioExistente) {
        throw new Error('Usuário com este email já existe');
      }
      
      // Executar a query INSERT para criar novo usuário
      const result = await pool.request()
        .input('nome', sql.VarChar, nome)
        .input('email', sql.VarChar, email)
        .input('senha', sql.VarChar, senha)
        .input('nivelId', sql.Int, nivelId)
        .input('bloqueado', sql.Bit, bloqueado ? 1 : 0)
        .query(`INSERT INTO usuarios (nome, email, senha, nivelId, bloqueado, dataCriacao, dataAtualizacao) 
                VALUES (@nome, @email, @senha, @nivelId, @bloqueado, GETDATE(), GETDATE()); 
                SELECT SCOPE_IDENTITY() as id`);
      
      // Obter o ID do novo usuário
      const novoId = result.recordset[0].id;
      
      // Retornar o novo usuário criado
      const novoUsuario = await this.obterPorId(novoId);
      return novoUsuario;
      
    } catch (erro) {
      throw erro;
    }
  }

  // Método para atualizar um usuário
  static async atualizar(id, userData) {
    try {
      const { nome, email, nivelId, bloqueado, senha } = userData;

      // Montar dinamicamente a query baseado nos campos fornecidos
      let setClauses = [];
      const request = pool.request().input('id', sql.Int, id);
      
      if (nome !== undefined) {
        setClauses.push('nome = @nome');
        request.input('nome', sql.VarChar, nome);
      }
      if (email !== undefined) {
        setClauses.push('email = @email');
        request.input('email', sql.VarChar, email);
      }
      if (senha !== undefined) {
        setClauses.push('senha = @senha');
        request.input('senha', sql.VarChar, senha);
      }
      if (nivelId !== undefined) {
        setClauses.push('nivelId = @nivelId');
        request.input('nivelId', sql.Int, nivelId);
      }
      if (bloqueado !== undefined) {
        setClauses.push('bloqueado = @bloqueado');
        request.input('bloqueado', sql.Bit, bloqueado ? 1 : 0);
      }

      // Sempre atualizar a data de atualização
      setClauses.push('dataAtualizacao = GETDATE()');

      if (setClauses.length === 1) {
        throw new Error('Nenhum campo foi fornecido para atualização');
      }

      const query = `UPDATE usuarios SET ${setClauses.join(', ')} WHERE id = @id`;
      
      await request.query(query);

      // Retornar o usuário atualizado
      const usuarioAtualizado = await this.obterPorId(id);
      return usuarioAtualizado;

    } catch (erro) {
      throw erro;
    }
  }
  
  // Método para verificar login (email e senha)
  static async verificarLogin(email, senha) {
    try {
      // Buscar o usuário pelo email
      const usuario = await this.obterPorEmail(email);
      
      // Se não encontrou o usuário
      if (!usuario) {
        return null;
      }

      // Verificar se o usuário está bloqueado
      if (usuario.bloqueado) {
        throw new Error('Usuário bloqueado');
      }
      
      // Comparar a senha (em produção, usar bcrypt)
      if (usuario.senha === senha) {
        // Retornar os dados públicos do usuário com seu nível
        return {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          nivelId: usuario.nivelId,
          nivelNome: usuario.nivelNome,
          bloqueado: usuario.bloqueado,
          dataCriacao: usuario.dataCriacao,
          dataAtualizacao: usuario.dataAtualizacao
        };
      }
      
      return null;
    } catch (erro) {
      console.error('Erro ao verificar login:', erro);
      throw erro;
    }
  }
}

// Exportar a classe para ser usada em outros arquivos
module.exports = Usuario;
