// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Função para criar as tabelas do banco de dados
async function criarTabelas() {
  try {
    // Aguardar o pool estar pronto
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n📊 Criando tabelas no banco de dados...\n');
    
    // SQL para criar a tabela de usuários
    const sqlUsuarios = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'usuarios')
      BEGIN
        CREATE TABLE usuarios (
          id INT PRIMARY KEY IDENTITY(1,1),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          dataCriacao DATETIME DEFAULT GETDATE(),
          dataAtualizacao DATETIME DEFAULT GETDATE()
        );
      END
    `;
    
    // SQL para criar a tabela de módulos
    const sqlModulos = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'modulos')
      BEGIN
        CREATE TABLE modulos (
          id INT PRIMARY KEY IDENTITY(1,1),
          nome VARCHAR(100) NOT NULL UNIQUE,
          descricao VARCHAR(255),
          ativo BIT DEFAULT 1,
          dataCriacao DATETIME DEFAULT GETDATE()
        );
      END
    `;
    
    // SQL para criar a tabela de permissões
    const sqlPermissoes = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'permissoes')
      BEGIN
        CREATE TABLE permissoes (
          id INT PRIMARY KEY IDENTITY(1,1),
          moduloId INT,
          nome VARCHAR(100) NOT NULL,
          descricao VARCHAR(255),
          chave VARCHAR(100) NOT NULL UNIQUE,
          ativo BIT DEFAULT 1,
          dataCriacao DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (moduloId) REFERENCES modulos(id)
        );
      END
    `;
    
    // SQL para criar a tabela de associação usuário-permissões
    const sqlUsuarioPermissoes = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'usuario_permissoes')
      BEGIN
        CREATE TABLE usuario_permissoes (
          id INT PRIMARY KEY IDENTITY(1,1),
          usuarioId INT NOT NULL,
          permissaoId INT NOT NULL,
          dataCriacao DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
          FOREIGN KEY (permissaoId) REFERENCES permissoes(id) ON DELETE CASCADE,
          UNIQUE(usuarioId, permissaoId)
        );
      END
    `;
    
    // Executar a criação de todas as tabelas
    await pool.request().query(sqlUsuarios);
    console.log('✓ Tabela "usuarios" criada/verificada com sucesso!');
    
    await pool.request().query(sqlModulos);
    console.log('✓ Tabela "modulos" criada/verificada com sucesso!');
    
    await pool.request().query(sqlPermissoes);
    console.log('✓ Tabela "permissoes" criada/verificada com sucesso!');
    
    await pool.request().query(sqlUsuarioPermissoes);
    console.log('✓ Tabela "usuario_permissoes" criada/verificada com sucesso!');
    
    console.log('\n✓ Banco de dados inicializado!\n');
    
  } catch (erro) {
    console.error('✗ Erro ao criar tabelas:', erro.message);
    process.exit(1);
  }
}

// Exportar a função para ser usada no servidor
module.exports = { criarTabelas };
