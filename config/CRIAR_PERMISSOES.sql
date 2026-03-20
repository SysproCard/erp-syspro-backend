-- ================================================
-- SCRIPT PARA CRIAR TABELAS DE PERMISSÕES
-- ================================================

-- TABELA 1: Módulos do Sistema
CREATE TABLE modulos (
    id INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    ativo BIT DEFAULT 1,
    dataCriacao DATETIME DEFAULT GETDATE()
);

-- TABELA 2: Permissões do Sistema (ações por módulo)
CREATE TABLE permissoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    moduloId INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    chave VARCHAR(50) NOT NULL UNIQUE,
    ativo BIT DEFAULT 1,
    dataCriacao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (moduloId) REFERENCES modulos(id)
);

-- TABELA 3: Relacionamento Usuário-Permissões
CREATE TABLE usuario_permissoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuarioId INT NOT NULL,
    permissaoId INT NOT NULL,
    dataCriacao DATETIME DEFAULT GETDATE(),
    UNIQUE(usuarioId, permissaoId),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (permissaoId) REFERENCES permissoes(id) ON DELETE CASCADE
);

-- ÍNDICES para melhor performance
CREATE INDEX idx_usuario_permissoes ON usuario_permissoes(usuarioId);
CREATE INDEX idx_modulo_permissoes ON permissoes(moduloId);

-- ================================================
-- INSERIR MÓDULOS PRINCIPAIS
-- ================================================

INSERT INTO modulos (nome, descricao) VALUES
('Empresas', 'Gerenciamento de empresas'),
('Prestadores', 'Gerenciamento de prestadores'),
('Usuários', 'Gerenciamento de usuários'),
('Transações', 'Gerenciamento de transações'),
('Relatórios', 'Visualização e geração de relatórios');

-- ================================================
-- INSERIR PERMISSÕES POR MÓDULO
-- ================================================

-- Permissões do módulo Empresas (ID 1)
INSERT INTO permissoes (moduloId, nome, descricao, chave) VALUES
(1, 'Editar Empresas', 'Permitir editar dados de empresas', 'empresas.editar'),
(1, 'Incluir Empresas', 'Permitir criar novas empresas', 'empresas.incluir'),
(1, 'Visualizar Empresas', 'Permitir visualizar empresas', 'empresas.visualizar'),
(1, 'Deletar Empresas', 'Permitir deletar empresas', 'empresas.deletar');

-- Permissões do módulo Prestadores (ID 2)
INSERT INTO permissoes (moduloId, nome, descricao, chave) VALUES
(2, 'Editar Prestadores', 'Permitir editar dados de prestadores', 'prestadores.editar'),
(2, 'Incluir Prestadores', 'Permitir criar novos prestadores', 'prestadores.incluir'),
(2, 'Visualizar Prestadores', 'Permitir visualizar prestadores', 'prestadores.visualizar'),
(2, 'Deletar Prestadores', 'Permitir deletar prestadores', 'prestadores.deletar'),
(2, 'Transações Prestador', 'Permitir gerenciar transações de prestadores', 'prestadores.transacoes');

-- Permissões do módulo Usuários (ID 3)
INSERT INTO permissoes (moduloId, nome, descricao, chave) VALUES
(3, 'Editar Usuários', 'Permitir editar dados de usuários', 'usuarios.editar'),
(3, 'Incluir Usuários', 'Permitir criar novos usuários', 'usuarios.incluir'),
(3, 'Visualizar Usuários', 'Permitir visualizar usuários', 'usuarios.visualizar'),
(3, 'Deletar Usuários', 'Permitir deletar usuários', 'usuarios.deletar'),
(3, 'Extrato Usuário', 'Permitir visualizar extrato do usuário', 'usuarios.extrato'),
(3, 'Gerar Arquivo', 'Permitir gerar arquivos de usuários', 'usuarios.gerar_arquivo'),
(3, 'Limite Usuário', 'Permitir alterar limite de usuários', 'usuarios.limite');

-- Permissões do módulo Transações (ID 4)
INSERT INTO permissoes (moduloId, nome, descricao, chave) VALUES
(4, 'Editar Transações', 'Permitir editar transações', 'transacoes.editar'),
(4, 'Incluir Transações', 'Permitir criar novas transações', 'transacoes.incluir'),
(4, 'Visualizar Transações', 'Permitir visualizar transações', 'transacoes.visualizar'),
(4, 'Excluir Transações', 'Permitir excluir transações', 'transacoes.excluir'),
(4, 'Verificar Duplicidade', 'Permitir verificar transações duplicadas', 'transacoes.duplicidade');

-- Permissões do módulo Relatórios (ID 5)
INSERT INTO permissoes (moduloId, nome, descricao, chave) VALUES
(5, 'Gerar Relatórios', 'Permitir gerar relatórios', 'relatorios.gerar'),
(5, 'Exportar Dados', 'Permitir exportar dados do sistema', 'relatorios.exportar'),
(5, 'Visualizar Relatórios', 'Permitir visualizar relatórios', 'relatorios.visualizar');

-- ================================================
-- VERIFICAR ESTRUTURA
-- ================================================

PRINT '=== MÓDULOS ===';
SELECT * FROM modulos;

PRINT '';
PRINT '=== PERMISSÕES POR MÓDULO ===';
SELECT m.nome AS 'Módulo', p.nome AS 'Permissão', p.chave FROM modulos m
LEFT JOIN permissoes p ON m.id = p.moduloId
ORDER BY m.id, p.nome;

PRINT '';
PRINT '✅ Tabelas de permissões criadas com sucesso!';
