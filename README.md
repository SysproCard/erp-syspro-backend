# ERP Syspro Backend

API simples de cadastro e login de usuários desenvolvida com Express.js e arquitetura MVC.

## Estrutura do Projeto

```
erp-syspro-backend/
├── controllers/          # Lógica de controle da aplicação
│   └── usuarioController.js
├── models/               # Modelos de dados
│   └── Usuario.js
├── routes/               # Definição das rotas da API
│   └── auth.js
├── dados/                # Pasta que será criada para armazenar dados
│   └── usuarios.json     # Banco de dados (arquivo JSON)
├── server.js             # Arquivo principal do servidor
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
```

## Instalação

1. Abra o terminal no diretório do projeto
2. Instale as dependências:
```bash
npm install
```

## Como Executar

Para rodar o servidor:
```bash
npm start
```

Ou para desenvolvimento com auto-reload (requer nodemon):
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Endpoints da API

### 1. Cadastro de Novo Usuário
**POST** `/auth/cadastro`

Body:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### 2. Login de Usuário
**POST** `/auth/login`

Body:
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### 3. Listar Todos os Usuários
**GET** `/auth/usuarios`

## Testando a API

Use ferramentas como Postman, Insomnia ou Thunder Client.

## Notas

⚠️ Este é um projeto básico de estudo - para produção, implemente:
- Hash de senhas com bcrypt
- Banco de dados real (MongoDB, PostgreSQL, etc)
- JWT para autenticação
- Validação avançada
- CORS
- Variáveis de ambiente