// Importar pool e sql do banco de dados
const { pool, sql } = require('../config/database');

// Função para criar as tabelas do banco de dados
async function criarTabelas() {
  try {
    // Aguardar o pool estar pronto
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n📊 Criando tabelas no banco de dados...\n');
    
    // SQL para criar a tabela de NÍVEIS (hierarquia de acesso)
    const sqlNiveis = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'niveis')
      BEGIN
        CREATE TABLE niveis (
          id INT PRIMARY KEY IDENTITY(1,1),
          nome VARCHAR(50) NOT NULL UNIQUE,
          descricao VARCHAR(255),
          ativo BIT DEFAULT 1,
          dataCriacao DATETIME DEFAULT GETDATE()
        );
      END
    `;
    
    // SQL para criar a tabela de usuários (REFATORADA - sem codigo)
    const sqlUsuarios = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'usuarios')
      BEGIN
        CREATE TABLE usuarios (
          id INT PRIMARY KEY IDENTITY(1,1),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          nivelId INT NOT NULL,
          bloqueado BIT DEFAULT 0,
          dataCriacao DATETIME DEFAULT GETDATE(),
          dataAtualizacao DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (nivelId) REFERENCES niveis(id)
        );
      END
    `;
    
    // SQL para criar a tabela de MENUS
    const sqlMenus = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'menus')
      BEGIN
        CREATE TABLE menus (
          id INT PRIMARY KEY IDENTITY(1,1),
          titulo VARCHAR(100) NOT NULL,
          rota VARCHAR(255),
          icon VARCHAR(50),
          ordem INT DEFAULT 0,
          ativo BIT DEFAULT 1,
          dataCriacao DATETIME DEFAULT GETDATE()
        );
      END
    `;
    
    // SQL para criar a tabela de PERMISSÕES DE MENUS (por nível)
    const sqlMenuPermissoes = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'menu_permissoes')
      BEGIN
        CREATE TABLE menu_permissoes (
          id INT PRIMARY KEY IDENTITY(1,1),
          menuId INT NOT NULL,
          nivelId INT NOT NULL,
          pode_ver BIT DEFAULT 1,
          pode_criar BIT DEFAULT 0,
          pode_editar BIT DEFAULT 0,
          pode_deletar BIT DEFAULT 0,
          dataCriacao DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE,
          FOREIGN KEY (nivelId) REFERENCES niveis(id) ON DELETE CASCADE,
          UNIQUE(menuId, nivelId)
        );
      END
    `;
    
    // Executar a criação de todas as tabelas
    await pool.request().query(sqlNiveis);
    console.log('✓ Tabela "niveis" criada/verificada com sucesso!');
    
    await pool.request().query(sqlUsuarios);
    console.log('✓ Tabela "usuarios" criada/verificada com sucesso!');
    
    await pool.request().query(sqlMenus);
    console.log('✓ Tabela "menus" criada/verificada com sucesso!');
    
    await pool.request().query(sqlMenuPermissoes);
    console.log('✓ Tabela "menu_permissoes" criada/verificada com sucesso!');
    
    console.log('\n✓ Banco de dados inicializado!\n');
    
  } catch (erro) {
    console.error('✗ Erro ao criar tabelas:', erro.message);
    process.exit(1);
  }
}

// Exportar a função para ser usada no servidor
module.exports = { criarTabelas };
