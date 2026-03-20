// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Importar classe de Permissão
const Permissao = require('./Permissao');

// Classe Usuario para gerenciar os dados dos usuários no SQL Server
class Usuario {
  
  // Método para obter todos os usuários do banco de dados
  static async obterTodos() {
    try {
      // Executar a query para buscar todos os usuários
      const result = await pool.request()
        .query(`SELECT id, codigo, nome, email, nivel, bloqueado, 
                alteraPercentualPrestador, alteraLimiteUsuarios, 
                efetuaCancelamentoBaixa, permiteExclusaoTransacoes, 
                permiteAlteracaoSituacao, permiteEscolherLocalBaixa, 
                dataCriacao, dataAtualizacao FROM usuarios`);
      
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
        .query(`SELECT id, codigo, nome, email, senha, nivel, bloqueado,
                alteraPercentualPrestador, alteraLimiteUsuarios, 
                efetuaCancelamentoBaixa, permiteExclusaoTransacoes, 
                permiteAlteracaoSituacao, permiteEscolherLocalBaixa, 
                dataCriacao, dataAtualizacao FROM usuarios WHERE email = @email`);
      
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
        .query(`SELECT id, codigo, nome, email, nivel, bloqueado,
                alteraPercentualPrestador, alteraLimiteUsuarios, 
                efetuaCancelamentoBaixa, permiteExclusaoTransacoes, 
                permiteAlteracaoSituacao, permiteEscolherLocalBaixa, 
                dataCriacao, dataAtualizacao FROM usuarios WHERE id = @id`);
      
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (erro) {
      console.error('Erro ao obter usuário por ID:', erro);
      return null;
    }
  }
  
  // Método para criar/salvar um novo usuário
  static async criar(userData) {
    try {
      const { nome, email, senha, nivel = 1, bloqueado = false,
              alteraPercentualPrestador = false, alteraLimiteUsuarios = false,
              efetuaCancelamentoBaixa = false, permiteExclusaoTransacoes = false,
              permiteAlteracaoSituacao = false, permiteEscolherLocalBaixa = false } = userData;

      // Validar campos obrigatórios
      if (!nome || !email || !senha) {
        throw new Error('Nome, email e senha são obrigatórios');
      }

      // Verificar se já existe um usuário com este email
      const usuarioExistente = await this.obterPorEmail(email);
      if (usuarioExistente) {
        throw new Error('Usuário com este email já existe');
      }
      
      // Executar a query INSERT para criar novo usuário com todas as permissões
      // O código será NULL inicialmente e será atualizado depois com o ID
      const result = await pool.request()
        .input('nome', sql.VarChar, nome)
        .input('email', sql.VarChar, email)
        .input('senha', sql.VarChar, senha)
        .input('nivel', sql.Int, nivel)
        .input('bloqueado', sql.Bit, bloqueado ? 1 : 0)
        .input('alteraPercentualPrestador', sql.Bit, alteraPercentualPrestador ? 1 : 0)
        .input('alteraLimiteUsuarios', sql.Bit, alteraLimiteUsuarios ? 1 : 0)
        .input('efetuaCancelamentoBaixa', sql.Bit, efetuaCancelamentoBaixa ? 1 : 0)
        .input('permiteExclusaoTransacoes', sql.Bit, permiteExclusaoTransacoes ? 1 : 0)
        .input('permiteAlteracaoSituacao', sql.Bit, permiteAlteracaoSituacao ? 1 : 0)
        .input('permiteEscolherLocalBaixa', sql.Bit, permiteEscolherLocalBaixa ? 1 : 0)
        .query(`INSERT INTO usuarios (codigo, nome, email, senha, nivel, bloqueado, 
                alteraPercentualPrestador, alteraLimiteUsuarios, 
                efetuaCancelamentoBaixa, permiteExclusaoTransacoes, 
                permiteAlteracaoSituacao, permiteEscolherLocalBaixa, dataCriacao, dataAtualizacao) 
                VALUES (NULL, @nome, @email, @senha, @nivel, @bloqueado, 
                @alteraPercentualPrestador, @alteraLimiteUsuarios, 
                @efetuaCancelamentoBaixa, @permiteExclusaoTransacoes, 
                @permiteAlteracaoSituacao, @permiteEscolherLocalBaixa, GETDATE(), GETDATE()); 
                SELECT SCOPE_IDENTITY() as id`);
      
      // Obter o ID do novo usuário
      const novoId = result.recordset[0].id;
      
      // Atualizar o código para ser igual ao ID (sequencial)
      await pool.request()
        .input('id', sql.Int, novoId)
        .input('codigo', sql.VarChar, novoId.toString())
        .query('UPDATE usuarios SET codigo = @codigo WHERE id = @id');
      
      // Retornar o novo usuário criado com código = ID
      return {
        id: novoId,
        codigo: novoId.toString(),
        nome: nome,
        email: email,
        nivel: nivel,
        bloqueado: bloqueado
      };
    } catch (erro) {
      throw erro;
    }
  }

  // Método para atualizar um usuário e suas permissões
  static async atualizar(id, userData) {
    try {
      const { codigo, nome, email, nivel, bloqueado,
              alteraPercentualPrestador, alteraLimiteUsuarios,
              efetuaCancelamentoBaixa, permiteExclusaoTransacoes,
              permiteAlteracaoSituacao, permiteEscolherLocalBaixa, senha } = userData;

      // Montar dinamicamente a query baseado nos campos fornecidos
      let setClauses = [];
      const request = pool.request().input('id', sql.Int, id);
      
      if (codigo !== undefined) {
        setClauses.push('codigo = @codigo');
        request.input('codigo', sql.VarChar, codigo || null);
      }
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
      if (nivel !== undefined) {
        setClauses.push('nivel = @nivel');
        request.input('nivel', sql.Int, nivel);
      }
      if (bloqueado !== undefined) {
        setClauses.push('bloqueado = @bloqueado');
        request.input('bloqueado', sql.Bit, bloqueado ? 1 : 0);
      }
      if (alteraPercentualPrestador !== undefined) {
        setClauses.push('alteraPercentualPrestador = @alteraPercentualPrestador');
        request.input('alteraPercentualPrestador', sql.Bit, alteraPercentualPrestador ? 1 : 0);
      }
      if (alteraLimiteUsuarios !== undefined) {
        setClauses.push('alteraLimiteUsuarios = @alteraLimiteUsuarios');
        request.input('alteraLimiteUsuarios', sql.Bit, alteraLimiteUsuarios ? 1 : 0);
      }
      if (efetuaCancelamentoBaixa !== undefined) {
        setClauses.push('efetuaCancelamentoBaixa = @efetuaCancelamentoBaixa');
        request.input('efetuaCancelamentoBaixa', sql.Bit, efetuaCancelamentoBaixa ? 1 : 0);
      }
      if (permiteExclusaoTransacoes !== undefined) {
        setClauses.push('permiteExclusaoTransacoes = @permiteExclusaoTransacoes');
        request.input('permiteExclusaoTransacoes', sql.Bit, permiteExclusaoTransacoes ? 1 : 0);
      }
      if (permiteAlteracaoSituacao !== undefined) {
        setClauses.push('permiteAlteracaoSituacao = @permiteAlteracaoSituacao');
        request.input('permiteAlteracaoSituacao', sql.Bit, permiteAlteracaoSituacao ? 1 : 0);
      }
      if (permiteEscolherLocalBaixa !== undefined) {
        setClauses.push('permiteEscolherLocalBaixa = @permiteEscolherLocalBaixa');
        request.input('permiteEscolherLocalBaixa', sql.Bit, permiteEscolherLocalBaixa ? 1 : 0);
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
        // Obter permissões do usuário agrupadas por módulo
        const permissoes = await Permissao.obterPorUsuarioAgrupado(usuario.id);
        
        // Retornar os dados públicos do usuário com as permissões
        return {
          id: usuario.id,
          codigo: usuario.codigo,
          nome: usuario.nome,
          email: usuario.email,
          nivel: usuario.nivel,
          bloqueado: usuario.bloqueado,
          dataCriacao: usuario.dataCriacao,
          dataAtualizacao: usuario.dataAtualizacao,
          permissoes: permissoes
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
