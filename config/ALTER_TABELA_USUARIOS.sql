-- ================================================
-- SCRIPT SQL PARA ADICIONAR CAMPOS DE PERMISSÕES
-- Execute no SQL Server Management Studio
-- ================================================

-- Verificar a estrutura atual da tabela
SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios';

-- ================================================
-- OPÇÃO 1: Se a tabela JÁ EXISTE com campos básicos
-- Adicionar as novas colunas
-- ================================================

-- Adicionar coluna 'codigo' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='codigo')
BEGIN
    ALTER TABLE usuarios ADD codigo VARCHAR(50) NULL;
END

-- Adicionar coluna 'nivel' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='nivel')
BEGIN
    ALTER TABLE usuarios ADD nivel INT DEFAULT 1;
END

-- Adicionar coluna 'bloqueado' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='bloqueado')
BEGIN
    ALTER TABLE usuarios ADD bloqueado BIT DEFAULT 0;
END

-- Adicionar coluna 'alteraPercentualPrestador' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='alteraPercentualPrestador')
BEGIN
    ALTER TABLE usuarios ADD alteraPercentualPrestador BIT DEFAULT 0;
END

-- Adicionar coluna 'alteraLimiteUsuarios' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='alteraLimiteUsuarios')
BEGIN
    ALTER TABLE usuarios ADD alteraLimiteUsuarios BIT DEFAULT 0;
END

-- Adicionar coluna 'efetuaCancelamentoBaixa' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='efetuaCancelamentoBaixa')
BEGIN
    ALTER TABLE usuarios ADD efetuaCancelamentoBaixa BIT DEFAULT 0;
END

-- Adicionar coluna 'permiteExclusaoTransacoes' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteExclusaoTransacoes')
BEGIN
    ALTER TABLE usuarios ADD permiteExclusaoTransacoes BIT DEFAULT 0;
END

-- Adicionar coluna 'permiteAlteracaoSituacao' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteAlteracaoSituacao')
BEGIN
    ALTER TABLE usuarios ADD permiteAlteracaoSituacao BIT DEFAULT 0;
END

-- Adicionar coluna 'permiteEscolherLocalBaixa' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='permiteEscolherLocalBaixa')
BEGIN
    ALTER TABLE usuarios ADD permiteEscolherLocalBaixa BIT DEFAULT 0;
END

-- Adicionar coluna 'dataAtualizacao' se não existir
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuarios' AND COLUMN_NAME='dataAtualizacao')
BEGIN
    ALTER TABLE usuarios ADD dataAtualizacao DATETIME DEFAULT GETDATE();
END

-- ================================================
-- Verificar as colunas após a alteração
-- ================================================
SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios' ORDER BY ORDINAL_POSITION;

-- ================================================
-- Verificar os dados existentes
-- ================================================
SELECT * FROM usuarios;

-- ================================================
-- Testes básicos após adição das colunas
-- ================================================

-- Inserir um usuário com todas as permissões
INSERT INTO usuarios (codigo, nome, email, senha, nivel, bloqueado, 
                     alteraPercentualPrestador, alteraLimiteUsuarios,
                     efetuaCancelamentoBaixa, permiteExclusaoTransacoes,
                     permiteAlteracaoSituacao, permiteEscolherLocalBaixa,
                     dataCriacao, dataAtualizacao)
VALUES ('ADM001', 'Administrador', 'admin@example.com', 'senha123', 5, 0,
        1, 1, 1, 1, 1, 1,
        GETDATE(), GETDATE());

-- Verificar o resultado
SELECT * FROM usuarios WHERE email = 'admin@example.com';
