-- Script de migração para adicionar campos de permissões na tabela usuarios
-- Executar este script no SQL Server Management Studio

-- Verificar se a tabela foi criada com a estrutura correta
-- Se a tabela ainda não existe, executar este comando para criar:

CREATE TABLE usuarios (
    id INT PRIMARY KEY IDENTITY(1,1),
    codigo VARCHAR(50) NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel INT DEFAULT 1,
    bloqueado BIT DEFAULT 0,
    
    -- Campos de permissões
    alteraPercentualPrestador BIT DEFAULT 0,
    alteraLimiteUsuarios BIT DEFAULT 0,
    efetuaCancelamentoBaixa BIT DEFAULT 0,
    permiteExclusaoTransacoes BIT DEFAULT 0,
    permiteAlteracaoSituacao BIT DEFAULT 0,
    permiteEscolherLocalBaixa BIT DEFAULT 0,
    
    -- Auditoria
    dataCriacao DATETIME DEFAULT GETDATE(),
    dataAtualizacao DATETIME DEFAULT GETDATE()
);

-- OU, se a tabela já existe com apenas os campos básicos, adicionar as novas colunas:

-- ALTER TABLE usuarios ADD codigo VARCHAR(50) NULL;
-- ALTER TABLE usuarios ADD nivel INT DEFAULT 1;
-- ALTER TABLE usuarios ADD bloqueado BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD alteraPercentualPrestador BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD alteraLimiteUsuarios BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD efetuaCancelamentoBaixa BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD permiteExclusaoTransacoes BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD permiteAlteracaoSituacao BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD permiteEscolherLocalBaixa BIT DEFAULT 0;
-- ALTER TABLE usuarios ADD dataAtualizacao DATETIME DEFAULT GETDATE();

-- Verificar a estrutura da tabela
SELECT * FROM usuarios;

-- Testar uma inserção com todos os campos
INSERT INTO usuarios (
    codigo, nome, email, senha, nivel, bloqueado,
    alteraPercentualPrestador, alteraLimiteUsuarios,
    efetuaCancelamentoBaixa, permiteExclusaoTransacoes,
    permiteAlteracaoSituacao, permiteEscolherLocalBaixa
) VALUES (
    '001', 'Administrador', 'admin@example.com', 'senha123', 5, 0,
    1, 1, 1, 1, 1, 1
);
