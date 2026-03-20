-- ================================================
-- SCRIPT SQL SIMPLES PARA CRIAR/ATUALIZAR TABELA
-- Execute no SQL Server Management Studio
-- ================================================

-- Passo 1: Verificar se a tabela usuarios existe
IF OBJECT_ID('dbo.usuarios', 'U') IS NULL
BEGIN
    -- Se não existe, criar a tabela completa
    CREATE TABLE usuarios (
        id INT PRIMARY KEY IDENTITY(1,1),
        codigo VARCHAR(50) NULL,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        nivel INT DEFAULT 1,
        bloqueado BIT DEFAULT 0,
        alteraPercentualPrestador BIT DEFAULT 0,
        alteraLimiteUsuarios BIT DEFAULT 0,
        efetuaCancelamentoBaixa BIT DEFAULT 0,
        permiteExclusaoTransacoes BIT DEFAULT 0,
        permiteAlteracaoSituacao BIT DEFAULT 0,
        permiteEscolherLocalBaixa BIT DEFAULT 0,
        dataCriacao DATETIME DEFAULT GETDATE(),
        dataAtualizacao DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabela usuarios CRIADA com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela usuarios já existe. Adicionando colunas faltantes...';
    
    -- Adicionar colunas uma por uma se não existirem
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='codigo')
        ALTER TABLE usuarios ADD codigo VARCHAR(50) NULL;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='nivel')
        ALTER TABLE usuarios ADD nivel INT DEFAULT 1;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='bloqueado')
        ALTER TABLE usuarios ADD bloqueado BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='alteraPercentualPrestador')
        ALTER TABLE usuarios ADD alteraPercentualPrestador BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='alteraLimiteUsuarios')
        ALTER TABLE usuarios ADD alteraLimiteUsuarios BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='efetuaCancelamentoBaixa')
        ALTER TABLE usuarios ADD efetuaCancelamentoBaixa BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteExclusaoTransacoes')
        ALTER TABLE usuarios ADD permiteExclusaoTransacoes BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteAlteracaoSituacao')
        ALTER TABLE usuarios ADD permiteAlteracaoSituacao BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteEscolherLocalBaixa')
        ALTER TABLE usuarios ADD permiteEscolherLocalBaixa BIT DEFAULT 0;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='dataAtualizacao')
        ALTER TABLE usuarios ADD dataAtualizacao DATETIME DEFAULT GETDATE();
    
    PRINT 'Colunas adicionadas com sucesso!';
END

-- Passo 2: Verificar a estrutura final da tabela
PRINT '';
PRINT '=== ESTRUTURA FINAL DA TABELA USUARIOS ===';
SELECT 
    ORDINAL_POSITION,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'usuarios' 
ORDER BY ORDINAL_POSITION;

-- Passo 3: Verificar quantos registros existem
PRINT '';
PRINT '=== DADOS EXISTENTES ===';
SELECT COUNT(*) as 'Total de Usuários' FROM usuarios;

-- Passo 4: Exibir todos os usuários
SELECT * FROM usuarios;

PRINT '';
PRINT '✅ Script executado com sucesso!';
