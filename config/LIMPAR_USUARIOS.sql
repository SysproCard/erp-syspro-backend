-- ================================================
-- SCRIPT PARA LIMPAR/RESETAR TABELA USUARIOS
-- ================================================

-- Opção 1: Deletar TODOS os usuários
DELETE FROM usuarios;

-- Opção 2: Resetar o IDENTITY (próximo ID será 1)
DBCC CHECKIDENT ('usuarios', RESEED, 0);

-- Verificar a tabela após limpeza
SELECT COUNT(*) as 'Total de Usuários' FROM usuarios;
SELECT * FROM usuarios;

PRINT '✅ Tabela usuarios limpa com sucesso!';
