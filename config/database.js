
// Importar o módulo mssql para conectar ao SQL Server
const sql = require('mssql');

// Importar dotenv para variáveis de ambiente
require('dotenv').config();

// Configuração de conexão com SQL Server
const config = {
  server: process.env.DB_HOST,           // Endereço do servidor SQL Server
  authentication: {
    type: 'default',                     // Tipo de autenticação
    options: {
      userName: process.env.DB_USER,     // Usuário do SQL Server
      password: process.env.DB_PASSWORD  // Senha do SQL Server
    }
  },
  options: {
    database: process.env.DB_NAME,       // Nome do banco de dados
    encrypt: false,                      // Sem criptografia de conexão
    trustServerCertificate: true,        // Confiar no certificado do servidor
    port: 1433                           // Porta padrão do SQL Server
  }
};

// Criar pool de conexões
const pool = new sql.ConnectionPool(config);

// Conectar ao banco de dados
pool.connect()
  .then(() => {
    console.log('✓ Conectado ao banco de dados SQL Server com sucesso!');
  })
  .catch(error => {
    console.error('✗ Erro ao conectar ao SQL Server:', error.message);
  });

// Exportar pool e módulo sql para serem usados em outros arquivos
module.exports = { pool, sql };
