// Importar o modelo Usuario
const Usuario = require('../models/Usuario');

// Objeto com todos os controladores
const usuarioController = {
  
  // Controlador para CADASTRO de novo usuário
  cadastro: async (req, res) => {
    try {
      // Extrair todos os dados do corpo da requisição
      // NOTA: O código é gerado automaticamente como cópia do ID
      const {
        nome, email, senha, nivel,
        bloqueado, alteraPercentualPrestador, alteraLimiteUsuarios,
        efetuaCancelamentoBaixa, permiteExclusaoTransacoes,
        permiteAlteracaoSituacao, permiteEscolherLocalBaixa
      } = req.body;
      
      // Validar se todos os campos obrigatórios foram preenchidos
      if (!nome || !email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, email e senha são obrigatórios'
        });
      }
      
      // Validar se o email tem um formato básico válido
      if (!email.includes('@')) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email inválido'
        });
      }
      
      // Tentar criar o novo usuário com todos os dados usando o modelo
      // O código será gerado automaticamente como cópia do ID
      const novoUsuario = await Usuario.criar({
        nome,
        email,
        senha,
        nivel: nivel || 1,
        bloqueado: bloqueado || false,
        alteraPercentualPrestador: alteraPercentualPrestador || false,
        alteraLimiteUsuarios: alteraLimiteUsuarios || false,
        efetuaCancelamentoBaixa: efetuaCancelamentoBaixa || false,
        permiteExclusaoTransacoes: permiteExclusaoTransacoes || false,
        permiteAlteracaoSituacao: permiteAlteracaoSituacao || false,
        permiteEscolherLocalBaixa: permiteEscolherLocalBaixa || false
      });
      
      // Se conseguir criar, retornar sucesso
      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: {
          id: novoUsuario.id,
          codigo: novoUsuario.codigo,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          nivel: novoUsuario.nivel,
          bloqueado: novoUsuario.bloqueado
        }
      });
      
    } catch (erro) {
      // Se houver erro (ex: email já existe), retornar erro
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },
  
  // Controlador para LOGIN de usuário
  login: async (req, res) => {
    try {
      // Extrair email e senha do corpo da requisição
      const { email, senha } = req.body;
      
      // Validar se email e senha foram fornecidos
      if (!email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email e senha são obrigatórios'
        });
      }
      
      // Tentar verificar o login usando o modelo
      const usuarioLogado = await Usuario.verificarLogin(email, senha);
      
      // Se o login foi bem-sucedido
      if (usuarioLogado) {
        res.status(200).json({
          sucesso: true,
          mensagem: 'Login realizado com sucesso!',
          usuario: usuarioLogado
        });
      } else {
        // Se email ou senha estão incorretos
        res.status(401).json({
          sucesso: false,
          mensagem: 'Email ou senha incorretos'
        });
      }
      
    } catch (erro) {
      // Se houver qualquer outro erro
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message || 'Erro no servidor'
      });
    }
  },
  
  // Controlador para LISTAR todos os usuários (apenas para teste)
  listarTodos: async (req, res) => {
    try {
      // Obter todos os usuários do modelo
      const usuarios = await Usuario.obterTodos();
      
      // Retornar os usuários (sem as senhas por segurança)
      res.status(200).json({
        sucesso: true,
        total: usuarios.length,
        usuarios: usuarios
      });
      
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar usuários'
      });
    }
  },

  // Controlador para ATUALIZAR um usuário e suas permissões
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        codigo, nome, email, senha, nivel,
        bloqueado, alteraPercentualPrestador, alteraLimiteUsuarios,
        efetuaCancelamentoBaixa, permiteExclusaoTransacoes,
        permiteAlteracaoSituacao, permiteEscolherLocalBaixa
      } = req.body;

      // Validar se o ID foi fornecido
      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      // Validar se email tem formato válido (se fornecido)
      if (email && !email.includes('@')) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email inválido'
        });
      }

      // Tentar atualizar o usuário
      const usuarioAtualizado = await Usuario.atualizar(id, {
        codigo,
        nome,
        email,
        senha,
        nivel,
        bloqueado,
        alteraPercentualPrestador,
        alteraLimiteUsuarios,
        efetuaCancelamentoBaixa,
        permiteExclusaoTransacoes,
        permiteAlteracaoSituacao,
        permiteEscolherLocalBaixa
      });

      if (!usuarioAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso!',
        usuario: usuarioAtualizado
      });

    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  },

  // Controlador para OBTER um usuário por ID
  obterPorId: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'ID do usuário é obrigatório'
        });
      }

      const usuario = await Usuario.obterPorId(id);

      if (!usuario) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        sucesso: true,
        usuario: usuario
      });

    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter usuário'
      });
    }
  }
};

// Exportar o objeto com todos os controladores
module.exports = usuarioController;
