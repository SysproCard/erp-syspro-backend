// Importar o módulo express
const express = require('express');

// Importar body-parser para interpretar dados JSON
const bodyParser = require('body-parser');

// Importar dotenv para variáveis de ambiente
require('dotenv').config();

// Importar as rotas de autenticação
const authRoutes = require('./routes/auth');

// Importar as rotas de permissões
const permissoesRoutes = require('./routes/permissoes');

// Importar a função para inicializar o banco de dados
const { criarTabelas } = require('./config/init');

// Criar uma aplicação express
const app = express();

// Definir a porta onde o servidor vai rodar (usa .env ou valor padrão)
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
// Middleware para interpretar dados JSON no corpo das requisições
app.use(bodyParser.json());

// Middleware para interpretar dados em formato URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// ===== ROTAS =====
// Usar as rotas de autenticação com o prefixo /api/auth
// Isso significa que todas as rotas começarão com /api/auth
app.use('/api/auth', authRoutes);

// Usar as rotas de permissões com o prefixo /api/permissoes
app.use('/api/permissoes', permissoesRoutes);

// ROTA RAIZ - apenas para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API ERP Syspro Backend está funcionando!',
    versao: '1.0.0',
    banco: 'SQL Server'
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// ===== INICIAR O SERVIDOR =====
// Função assíncrona para inicializar o servidor
async function iniciarServidor() {
  try {
    // Criar as tabelas do banco de dados (se não existirem)
    await criarTabelas();
    
    // Fazer o servidor escutar na porta definida
    app.listen(PORT, () => {
      console.log(`\n✓ Servidor rodando em http://localhost:${PORT}`);
      console.log(`\nRotas de Autenticação disponíveis:`);
      console.log(`  POST   /api/auth/cadastro  - Cadastrar novo usuário`);
      console.log(`  POST   /api/auth/login     - Fazer login`);
      console.log(`  GET    /api/auth/usuarios  - Listar todos os usuários`);
      console.log(`\nRotas de Permissões disponíveis:`);
      console.log(`  GET    /api/permissoes/modulos              - Listar módulos`);
      console.log(`  GET    /api/permissoes/todas               - Listar todas permissões`);
      console.log(`  GET    /api/permissoes/usuario/:usuarioId  - Permissões do usuário`);
      console.log(`  PUT    /api/permissoes/usuario/:usuarioId  - Atualizar permissões\n`);
    });
  } catch (erro) {
    console.error('✗ Erro ao iniciar o servidor:', erro);
    process.exit(1);
  }
}

// Chamar a função para iniciar o servidor
iniciarServidor();
