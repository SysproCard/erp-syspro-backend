# Sistema de Permissões de Usuários - Documentação API

## Campos de Permissões Adicionados

### 1. **Cadastro de Usuário** (PUT/POST)
Todos os campos de permissões são opcionais e padrão para `false` (desabilitado)

```json
{
  "codigo": "001",
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "nivel": 2,
  "bloqueado": false,
  "alteraPercentualPrestador": true,
  "alteraLimiteUsuarios": true,
  "efetuaCancelamentoBaixa": false,
  "permiteExclusaoTransacoes": false,
  "permiteAlteracaoSituacao": true,
  "permiteEscolherLocalBaixa": false
}
```

## Endpoints Disponíveis

### 1. **CADASTRO DE NOVO USUÁRIO**
- **Método**: POST
- **URL**: `/auth/cadastro`
- **Descrição**: Cria um novo usuário com permissões

**Exemplo de Requisição:**
```javascript
fetch('http://localhost:3000/auth/cadastro', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    codigo: "002",
    nome: "Maria Oliveira",
    email: "maria@example.com",
    senha: "senha456",
    nivel: 3,
    bloqueado: false,
    alteraPercentualPrestador: true,
    alteraLimiteUsuarios: false,
    efetuaCancelamentoBaixa: true,
    permiteExclusaoTransacoes: false,
    permiteAlteracaoSituacao: true,
    permiteEscolherLocalBaixa: true
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Resposta de Sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário cadastrado com sucesso!",
  "usuario": {
    "id": 1,
    "codigo": "002",
    "nome": "Maria Oliveira",
    "email": "maria@example.com",
    "nivel": 3,
    "bloqueado": false
  }
}
```

---

### 2. **LOGIN**
- **Método**: POST
- **URL**: `/auth/login`
- **Descrição**: Realiza login e retorna dados do usuário com permissões

**Exemplo de Requisição:**
```javascript
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: "maria@example.com",
    senha: "senha456"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso!",
  "usuario": {
    "id": 1,
    "codigo": "002",
    "nome": "Maria Oliveira",
    "email": "maria@example.com",
    "nivel": 3,
    "bloqueado": false,
    "permissoes": {
      "alteraPercentualPrestador": true,
      "alteraLimiteUsuarios": false,
      "efetuaCancelamentoBaixa": true,
      "permiteExclusaoTransacoes": false,
      "permiteAlteracaoSituacao": true,
      "permiteEscolherLocalBaixa": true
    }
  }
}
```

---

### 3. **LISTAR TODOS OS USUÁRIOS**
- **Método**: GET
- **URL**: `/auth/usuarios`
- **Descrição**: Retorna listagem completa de todos os usuários

**Exemplo de Requisição:**
```javascript
fetch('http://localhost:3000/auth/usuarios')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "total": 2,
  "usuarios": [
    {
      "id": 1,
      "codigo": "001",
      "nome": "João Silva",
      "email": "joao@example.com",
      "nivel": 2,
      "bloqueado": false,
      "alteraPercentualPrestador": true,
      "alteraLimiteUsuarios": true,
      "efetuaCancelamentoBaixa": false,
      "permiteExclusaoTransacoes": false,
      "permiteAlteracaoSituacao": true,
      "permiteEscolherLocalBaixa": false,
      "dataCriacao": "2026-03-20T10:30:00.000Z",
      "dataAtualizacao": "2026-03-20T10:30:00.000Z"
    },
    {
      "id": 2,
      "codigo": "002",
      "nome": "Maria Oliveira",
      "email": "maria@example.com",
      "nivel": 3,
      "bloqueado": false,
      "alteraPercentualPrestador": true,
      "alteraLimiteUsuarios": false,
      "efetuaCancelamentoBaixa": true,
      "permiteExclusaoTransacoes": false,
      "permiteAlteracaoSituacao": true,
      "permiteEscolherLocalBaixa": true,
      "dataCriacao": "2026-03-20T11:00:00.000Z",
      "dataAtualizacao": "2026-03-20T11:00:00.000Z"
    }
  ]
}
```

---

### 4. **OBTER USUÁRIO POR ID**
- **Método**: GET
- **URL**: `/auth/usuarios/:id`
- **Descrição**: Retorna dados completos de um usuário específico

**Exemplo de Requisição:**
```javascript
fetch('http://localhost:3000/auth/usuarios/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": 1,
    "codigo": "001",
    "nome": "João Silva",
    "email": "joao@example.com",
    "nivel": 2,
    "bloqueado": false,
    "alteraPercentualPrestador": true,
    "alteraLimiteUsuarios": true,
    "efetuaCancelamentoBaixa": false,
    "permiteExclusaoTransacoes": false,
    "permiteAlteracaoSituacao": true,
    "permiteEscolherLocalBaixa": false,
    "dataCriacao": "2026-03-20T10:30:00.000Z",
    "dataAtualizacao": "2026-03-20T10:30:00.000Z"
  }
}
```

---

### 5. **ATUALIZAR USUÁRIO E SUAS PERMISSÕES**
- **Método**: PUT
- **URL**: `/auth/usuarios/:id`
- **Descrição**: Atualiza dados e permissões de um usuário existente

**Exemplo de Requisição:**
```javascript
fetch('http://localhost:3000/auth/usuarios/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: "João Silva Atualizado",
    nivel: 4,
    bloqueado: false,
    alteraPercentualPrestador: false,
    alteraLimiteUsuarios: true,
    efetuaCancelamentoBaixa: true,
    permiteExclusaoTransacoes: true,
    permiteAlteracaoSituacao: false,
    permiteEscolherLocalBaixa: true
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário atualizado com sucesso!",
  "usuario": {
    "id": 1,
    "codigo": "001",
    "nome": "João Silva Atualizado",
    "email": "joao@example.com",
    "nivel": 4,
    "bloqueado": false,
    "alteraPercentualPrestador": false,
    "alteraLimiteUsuarios": true,
    "efetuaCancelamentoBaixa": true,
    "permiteExclusaoTransacoes": true,
    "permiteAlteracaoSituacao": false,
    "permiteEscolherLocalBaixa": true,
    "dataCriacao": "2026-03-20T10:30:00.000Z",
    "dataAtualizacao": "2026-03-20T15:45:00.000Z"
  }
}
```

---

## Descrição dos Campos de Permissões

| Campo | Descrição |
|-------|-----------|
| `codigo` | Código único do usuário (opcional) |
| `nivel` | Nível de acesso do usuário (1-5, padrão: 1) |
| `bloqueado` | Se o usuário está bloqueado (true/false, padrão: false) |
| `alteraPercentualPrestador` | Permite alterar percentual de prestador |
| `alteraLimiteUsuarios` | Permite alterar limite dos usuários |
| `efetuaCancelamentoBaixa` | Permite efetuar cancelamento de baixa |
| `permiteExclusaoTransacoes` | Permite exclusão de transações |
| `permiteAlteracaoSituacao` | Permite alteração de situação/limite de alimentação |
| `permiteEscolherLocalBaixa` | Permite escolher local de baixa |

---

## Códigos de Erro

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| 400 | Email inválido | Email não contém @ |
| 400 | Nome, email e senha são obrigatórios | Campo obrigatório não foi preenchido |
| 400 | Usuário com este email já existe | Email já cadastrado no sistema |
| 400 | Nenhum campo foi fornecido | Na atualização sem campos válidos |
| 401 | Email ou senha incorretos | Credenciais inválidas no login |
| 404 | Usuário não encontrado | ID do usuário não existe |
| 500 | Erro ao listar usuários | Erro no servidor |

---

## Notas Importantes

1. **Estrutura do Banco de Dados**: Certifique-se de executar o script SQL em `config/database_migrations.sql` para criar/atualizar a tabela
2. **Segurança**: Em produção, use `bcrypt` para hash de senhas
3. **Permissões por Padrão**: Todos os campos booleanos de permissões são `false` por padrão
4. **DataAtualizacao**: É atualizada automaticamente em cada modificação
5. **Usuários Bloqueados**: Não conseguem fazer login até serem desbloqueados

---

## Exemplos Práticos

### Criar admin com todas as permissões
```json
POST /auth/cadastro
{
  "codigo": "ADMIN001",
  "nome": "Administrador",
  "email": "admin@empresa.com",
  "senha": "segura123",
  "nivel": 5,
  "bloqueado": false,
  "alteraPercentualPrestador": true,
  "alteraLimiteUsuarios": true,
  "efetuaCancelamentoBaixa": true,
  "permiteExclusaoTransacoes": true,
  "permiteAlteracaoSituacao": true,
  "permiteEscolherLocalBaixa": true
}
```

### Bloquear um usuário
```json
PUT /auth/usuarios/1
{
  "bloqueado": true
}
```

### Remover todas as permissões de um usuário
```json
PUT /auth/usuarios/2
{
  "alteraPercentualPrestador": false,
  "alteraLimiteUsuarios": false,
  "efetuaCancelamentoBaixa": false,
  "permiteExclusaoTransacoes": false,
  "permiteAlteracaoSituacao": false,
  "permiteEscolherLocalBaixa": false
}
```
