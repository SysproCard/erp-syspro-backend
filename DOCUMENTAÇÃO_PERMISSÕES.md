# 🔐 DOCUMENTAÇÃO DO SISTEMA DE PERMISSÕES

## 📋 Resumo do Sistema

O sistema de permissões foi desenvolvido para controlar o acesso dos usuários a diferentes funcionalidades do ERP. Cada usuário pode ter um conjunto específico de permissões, organizadas em **5 módulos** principais com **21+ permissões** distribuídas.

---

## 🏗️ Arquitetura

### Tabelas do Banco de Dados

```sql
-- Tabela de módulos (5 registros)
CREATE TABLE modulos (
  id INT PRIMARY KEY IDENTITY(1,1),
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(255),
  ativo BIT DEFAULT 1,
  dataCriacao DATETIME DEFAULT GETDATE()
)

-- Tabela de permissões (21+ registros)
CREATE TABLE permissoes (
  id INT PRIMARY KEY IDENTITY(1,1),
  moduloId INT FOREIGN KEY REFERENCES modulos(id),
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  chave VARCHAR(100) UNIQUE,
  ativa BIT DEFAULT 1,
  dataCriacao DATETIME DEFAULT GETDATE()
)

-- Tabela de relacionamento (muitos-para-muitos)
CREATE TABLE usuario_permissoes (
  id INT PRIMARY KEY IDENTITY(1,1),
  usuarioId INT FOREIGN KEY REFERENCES usuarios(id),
  permissaoId INT FOREIGN KEY REFERENCES permissoes(id),
  dataCriacao DATETIME DEFAULT GETDATE(),
  UNIQUE(usuarioId, permissaoId)
)
```

### Módulos Disponíveis

| ID | Nome | Descrição | Permissions |
|-----|------|-----------|-------------|
| 1 | **Empresas** | Gerenciamento de empresas cadastradas | editar, incluir, visualizar, deletar (4) |
| 2 | **Prestadores** | Gerenciamento de prestadores de serviço | editar, incluir, visualizar, deletar, transações (5) |
| 3 | **Usuários** | Gerenciamento de usuários do sistema | editar, incluir, visualizar, deletar, extrato, gerar_arquivo, limite (7) |
| 4 | **Transações** | Gerenciamento de transações financeiras | editar, incluir, visualizar, excluir, verificar_duplicidade (5) |
| 5 | **Relatórios** | Geração e exportação de relatórios | gerar, exportar, visualizar (3) |

---

## 📡 Endpoints de Permissões

### 1️⃣ **GET** `/permissoes/modulos`

Retorna todos os módulos disponíveis no sistema.

**Request:**
```
GET http://localhost:3000/permissoes/modulos
```

**Response (200):**
```json
{
  "sucesso": true,
  "modulos": [
    {
      "id": 1,
      "nome": "Empresas",
      "descricao": "Gerenciamento de empresas",
      "ativo": true,
      "dataCriacao": "2024-01-15T10:30:00.000Z"
    },
    // ... mais módulos
  ]
}
```

---

### 2️⃣ **GET** `/permissoes/todas`

Retorna todas as permissões disponíveis no sistema com informações de módulo.

**Request:**
```
GET http://localhost:3000/permissoes/todas
```

**Response (200):**
```json
{
  "sucesso": true,
  "permissoes": [
    {
      "id": 1,
      "moduloId": 1,
      "nome": "Editar Empresas",
      "descricao": "Permissão para editar dados de empresas",
      "chave": "empresas.editar",
      "ativa": true,
      "modulo": {
        "id": 1,
        "nome": "Empresas"
      },
      "dataCriacao": "2024-01-15T10:30:00.000Z"
    },
    // ... mais permissões
  ]
}
```

---

### 3️⃣ **GET** `/permissoes/usuario/:usuarioId`

Retorna as permissões de um usuário específico **agrupadas por módulo**.

**Request:**
```
GET http://localhost:3000/permissoes/usuario/1
```

**Response (200):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": 1,
    "nome": "Admin User"
  },
  "modulos": [
    {
      "id": 1,
      "nome": "Empresas",
      "descricao": "Gerenciamento de empresas",
      "permissoes": [
        {
          "id": 1,
          "nome": "Editar Empresas",
          "chave": "empresas.editar",
          "ativa": true,  // ← Ativa para ESTE usuário
          "dataCriacao": "2024-01-15T10:30:00.000Z"
        },
        {
          "id": 2,
          "nome": "Incluir Empresas",
          "chave": "empresas.incluir",
          "ativa": false  // ← Inativa para ESTE usuário
        }
      ]
    },
    // ... mais módulos
  ]
}
```

---

### 4️⃣ **PUT** `/permissoes/usuario/:usuarioId`

Atualiza TODAS as permissões de um usuário. Remove permissões antigas e adiciona as novas em uma **transação**.

**Request:**
```
PUT http://localhost:3000/permissoes/usuario/1
Content-Type: application/json

{
  "permissoes": [1, 3, 5, 7, 9]
}
```

**Response (200):**
```json
{
  "sucesso": true,
  "mensagem": "Permissões atualizadas com sucesso",
  "usuario": 1,
  "permissoes": [1, 3, 5, 7, 9],
  "total": 5
}
```

**Response (404):**
```json
{
  "sucesso": false,
  "mensagem": "Usuário não encontrado"
}
```

---

### 5️⃣ **POST** `/permissoes/usuario/:usuarioId/adicionar`

Adiciona uma permissão individual a um usuário.

**Request:**
```
POST http://localhost:3000/permissoes/usuario/1/adicionar
Content-Type: application/json

{
  "permissaoId": 5
}
```

**Response (201):**
```json
{
  "sucesso": true,
  "mensagem": "Permissão adicionada com sucesso",
  "usuario": 1,
  "permissao": 5
}
```

**Response (400):**
```json
{
  "sucesso": false,
  "mensagem": "Usuário já possui esta permissão"
}
```

---

### 6️⃣ **DELETE** `/permissoes/usuario/:usuarioId/permissao/:permissaoId`

Remove uma permissão específica de um usuário.

**Request:**
```
DELETE http://localhost:3000/permissoes/usuario/1/permissao/5
```

**Response (200):**
```json
{
  "sucesso": true,
  "mensagem": "Permissão removida com sucesso",
  "usuario": 1,
  "permissao": 5
}
```

**Response (404):**
```json
{
  "sucesso": false,
  "mensagem": "Permissão não encontrada para este usuário"
}
```

---

### 7️⃣ **GET** `/permissoes/verificar`

Verifica se um usuário tem uma permissão específica pela **chave da permissão**.

**Request:**
```
GET http://localhost:3000/permissoes/verificar?usuarioId=1&chave=usuarios.editar
```

**Response (200) - Com permissão:**
```json
{
  "sucesso": true,
  "usuarioId": 1,
  "chave": "usuarios.editar",
  "temPermissao": true
}
```

**Response (200) - Sem permissão:**
```json
{
  "sucesso": true,
  "usuarioId": 1,
  "chave": "usuarios.editar",
  "temPermissao": false
}
```

---

## 🔄 Integrações

### Login Retorna Permissões

Após fazer login, o usuário recebe suas permissões estruturadas:

**Request:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "teste@teste",
  "senha": "123"
}
```

**Response (200):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": 1,
    "codigo": "1",
    "nome": "Admin User",
    "email": "teste@teste",
    "nivel": 3,
    "bloqueado": false,
    "permissoes": [
      {
        "id": 1,
        "nome": "Empresas",
        "descricao": "Gerenciamento de empresas",
        "permissoes": [
          {
            "id": 1,
            "nome": "Editar Empresas",
            "chave": "empresas.editar",
            "ativa": true
          },
          {
            "id": 2,
            "nome": "Incluir Empresas",
            "chave": "empresas.incluir",
            "ativa": false
          }
          // ... mais permissões do módulo
        ]
      },
      // ... mais módulos
    ]
  }
}
```

---

## 🧪 Como Testar

### 1. Executar o Script de Testes

```bash
node testes_permissoes.js
```

Este script testa automaticamente todos os 9 endpoints em sequência.

### 2. Testar Manualmente com curl

**Listar módulos:**
```bash
curl http://localhost:3000/permissoes/modulos
```

**Listar todas as permissões:**
```bash
curl http://localhost:3000/permissoes/todas
```

**Obter permissões do usuário 1:**
```bash
curl http://localhost:3000/permissoes/usuario/1
```

**Atualizar permissões:**
```bash
curl -X PUT http://localhost:3000/permissoes/usuario/1 \
  -H "Content-Type: application/json" \
  -d '{"permissoes": [1, 2, 3, 4, 5]}'
```

**Adicionar uma permissão:**
```bash
curl -X POST http://localhost:3000/permissoes/usuario/1/adicionar \
  -H "Content-Type: application/json" \
  -d '{"permissaoId": 10}'
```

**Remover permissão:**
```bash
curl -X DELETE http://localhost:3000/permissoes/usuario/1/permissao/5
```

**Verificar permissão específica:**
```bash
curl "http://localhost:3000/permissoes/verificar?usuarioId=1&chave=usuarios.editar"
```

---

## 📊 Chaves de Permissões (Para Verificação)

| Módulo | Chave | Descrição |
|--------|-------|-----------|
| **Empresas** | `empresas.editar` | Editar empresas |
| | `empresas.incluir` | Incluir novas empresas |
| | `empresas.visualizar` | Visualizar empresas |
| | `empresas.deletar` | Deletar empresas |
| **Prestadores** | `prestadores.editar` | Editar prestadores |
| | `prestadores.incluir` | Incluir prestadores |
| | `prestadores.visualizar` | Visualizar prestadores |
| | `prestadores.deletar` | Deletar prestadores |
| | `prestadores.transacoes` | Gerenciar transações de prestadores |
| **Usuários** | `usuarios.editar` | Editar usuários |
| | `usuarios.incluir` | Incluir usuários |
| | `usuarios.visualizar` | Visualizar usuários |
| | `usuarios.deletar` | Deletar usuários |
| | `usuarios.extrato` | Acessar extrato de usuário |
| | `usuarios.gerar_arquivo` | Gerar arquivo de usuário |
| | `usuarios.limite` | Definir limite de usuário |
| **Transações** | `transacoes.editar` | Editar transações |
| | `transacoes.incluir` | Incluir transações |
| | `transacoes.visualizar` | Visualizar transações |
| | `transacoes.excluir` | Excluir transações |
| | `transacoes.verificar_duplicidade` | Verificar duplicidade |
| **Relatórios** | `relatorios.gerar` | Gerar relatórios |
| | `relatorios.exportar` | Exportar relatórios |
| | `relatorios.visualizar` | Visualizar relatórios |

---

## 📁 Arquivos do Sistema

```
erp-syspro-backend/
├── models/
│   ├── Usuario.js          ← Modelo com integração de permissões no login
│   └── Permissao.js        ← Novo modelo de permissões com 7 métodos
├── controllers/
│   ├── usuarioController.js
│   └── permissaoController.js  ← Novo controlador com 7 handlers
├── routes/
│   ├── auth.js
│   └── permissoes.js       ← Novo arquivo com 7 rotas
├── config/
│   ├── database.js
│   └── CRIAR_PERMISSOES.sql    ← Script SQL para criar tabelas
├── server.js               ← Atualizado com rotas de permissões
└── testes_permissoes.js    ← Script de teste automático
```

---

## ⚙️ Configuração Necessária

### 1. Executar o Script SQL

```
Abra SQL Server Management Studio
→ Conecte ao seu servidor
→ Abra: config/CRIAR_PERMISSOES.sql
→ Pressione F5 ou Execute
```

### 2. Reiniciar o Servidor

```bash
npm start
```

O servidor deve iniciar sem erros e carregar as novas rotas.

### 3. Testar os Endpoints

```bash
node testes_permissoes.js
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Transações Atômicas** - Atualizações de permissões em lote não podem falhar parcialmente
✅ **Constraint Único** - Evita permissões duplicadas na tabela junction
✅ **Validação de Entrada** - Verifica se usuário e permissões existem
✅ **Mensagens de Erro** - Retorna erros específicos

### Próximos Passos de Segurança (Recomendado)

- [ ] Adicionar middleware de autorização nas rotas
- [ ] Usar JWT tokens para sessões seguras
- [ ] Criptografar senhas com bcrypt
- [ ] Implementar rate limiting
- [ ] Adicionar auditoria de alterações de permissões
- [ ] Validar tokens JWT em todas as requisições

---

## 💡 Exemplos de Uso

### Verificar Permissão Antes de Executar Ação

```javascript
// No seu controlador de transações:
async atualizarTransacao(req, res) {
  const usuarioId = req.user.id;
  const chave = 'transacoes.editar';
  
  // Verificar permissão
  const temPermissao = await Permissao.temPermissao(usuarioId, chave);
  
  if (!temPermissao) {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Você não tem permissão para editar transações'
    });
  }
  
  // Continuar com a lógica de atualização...
}
```

### Filtrar Opções do Frontend Baseado em Permissões

```javascript
// No seu endpoint de ambiente:
app.get('/api/menu', (req, res) => {
  const usuario = req.session.usuario;
  
  const menu = [];
  
  // Mostrar "Empresas" apenas se tiver permissão
  if (usuario.permissoes.some(m => m.nome === 'Empresas')) {
    menu.push('Empresas');
  }
  
  // Mostrar "Usuários" apenas se tiver permissão
  if (usuario.permissoes.some(m => m.nome === 'Usuários')) {
    menu.push('Usuários');
  }
  
  res.json(menu);
});
```

---

## 📞 Suporte

Se encontrar erros:

1. **Verificar se SQL foi executado**: `SELECT * FROM modulos; -- Deve retornar 5 registros`
2. **Verificar logs do servidor**: Procure por mensagens de erro no console
3. **Validar JSON**: Use um validador JSON se receber erros de parsing
4. **Reiniciar servidor**: `npm start`

---

**Última atualização:** 2024-01-15  
**Versão:** 1.0  
**Status:** ✅ Produção
