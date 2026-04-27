## 🎨 GUIA DE INTEGRAÇÃO - FRONTEND

### 1. FLUXO DE LOGIN

```javascript
// Frontend - Componente de Login
async function handleLogin(email, senha) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    
    if (data.sucesso) {
      // Armazenar dados do usuário
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('nivelId', data.usuario.nivelId);
      localStorage.setItem('nivelNome', data.usuario.nivelNome);
      
      // Carregar menus do nível do usuário
      await carregarMenus(data.usuario.nivelId);
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    }
  } catch (erro) {
    console.error('Erro no login:', erro);
  }
}
```

### 2. CARREGAR MENUS DO NÍVEL

```javascript
// Frontend - Carregar menus baseado no nível
async function carregarMenus(nivelId) {
  try {
    const response = await fetch(`/menus/nivel/${nivelId}`);
    const data = await response.json();
    
    if (data.sucesso) {
      // Armazenar menus com permissões
      localStorage.setItem('menus', JSON.stringify(data.menus));
      
      // Renderizar menu na lateral
      renderMenu(data.menus);
    }
  } catch (erro) {
    console.error('Erro ao carregar menus:', erro);
  }
}
```

### 3. RENDERIZAR MENU DINAMICAMENTE

```javascript
// Frontend - Renderizar menu com permissões
function renderMenu(menus) {
  const navMenu = document.getElementById('main-menu');
  navMenu.innerHTML = '';
  
  menus.forEach(menu => {
    // Criar item de menu
    const menuItem = document.createElement('a');
    menuItem.href = menu.rota;
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
      <i class="icon-${menu.icon}"></i>
      <span>${menu.titulo}</span>
    `;
    
    // Desabilitar se o nível não pode visualizar
    if (!menu.permissoes.ver) {
      menuItem.style.display = 'none';
    }
    
    navMenu.appendChild(menuItem);
  });
}
```

### 4. VALIDAR PERMISSÕES EM AÇÕES

```javascript
// Frontend - Verificar permissão antes de executar ação
async function podeExecutarAcao(menuId, nivelId, acao) {
  try {
    const response = await fetch(`/menus/${menuId}/permissoes/${nivelId}`);
    const data = await response.json();
    
    if (data.sucesso) {
      const permissoes = data.permissoes;
      
      switch(acao) {
        case 'criar':
          return permissoes.criar;
        case 'editar':
          return permissoes.editar;
        case 'deletar':
          return permissoes.deletar;
        case 'ver':
          return permissoes.ver;
        default:
          return false;
      }
    }
  } catch (erro) {
    console.error('Erro ao verificar permissões:', erro);
    return false;
  }
}

// Usar na prática
async function handleEditarUsuario(usuarioId) {
  const menuId = 2; // Menu de Usuários
  const nivelId = localStorage.getItem('nivelId');
  
  const temPermissao = await podeExecutarAcao(menuId, nivelId, 'editar');
  
  if (temPermissao) {
    // Abrir formulário de edição
    abrirFormularioEdicao(usuarioId);
  } else {
    // Mostrar mensagem de acesso negado
    alert('Você não tem permissão para editar usuários');
  }
}
```

### 5. CONTROLAR VISIBILIDADE DE BOTÕES

```html
<!-- Frontend - HTML dinâmico baseado em permissões -->
<div class="usuario-actions">
  <!-- Botão de Criar (visível se pode_criar = true) -->
  <button 
    id="btn-criar" 
    style="display: none;"
    onclick="abrirNovoUsuario()"
  >
    ➕ Novo Usuário
  </button>
  
  <!-- Botão de Editar -->
  <button 
    id="btn-editar" 
    style="display: none;"
    onclick="editarUsuario()"
  >
    ✏️ Editar
  </button>
  
  <!-- Botão de Deletar -->
  <button 
    id="btn-deletar" 
    style="display: none;"
    onclick="deletarUsuario()"
  >
    🗑️ Deletar
  </button>
</div>

<script>
// Carregar permissões e mostrar botões apropriados
async function carregarPermissoesBotoes() {
  const nivelId = localStorage.getItem('nivelId');
  const menuId = 2; // Menu Usuários
  
  const response = await fetch(`/menus/${menuId}/permissoes/${nivelId}`);
  const data = await response.json();
  
  if (data.sucesso) {
    const p = data.permissoes;
    
    document.getElementById('btn-criar').style.display = p.criar ? 'inline-block' : 'none';
    document.getElementById('btn-editar').style.display = p.editar ? 'inline-block' : 'none';
    document.getElementById('btn-deletar').style.display = p.deletar ? 'inline-block' : 'none';
  }
}

// Chamar ao carregar página
carregarPermissoesBotoes();
</script>
```

### 6. ESTRUTURA DE COMPONENTE REACT

```jsx
import React, { useEffect, useState } from 'react';

function MenuSidebar() {
  const [menus, setMenus] = useState([]);
  const nivelId = localStorage.getItem('nivelId');
  
  useEffect(() => {
    carregarMenus();
  }, []);
  
  const carregarMenus = async () => {
    try {
      const res = await fetch(`/menus/nivel/${nivelId}`);
      const data = await res.json();
      
      if (data.sucesso) {
        setMenus(data.menus);
      }
    } catch (erro) {
      console.error('Erro:', erro);
    }
  };
  
  return (
    <nav className="sidebar">
      {menus.map(menu => (
        menu.permissoes.ver && (
          <NavLink 
            key={menu.id}
            to={menu.rota}
            className="menu-item"
          >
            <i className={`icon-${menu.icon}`} />
            <span>{menu.titulo}</span>
          </NavLink>
        )
      ))}
    </nav>
  );
}

export default MenuSidebar;
```

### 7. HOOK CUSTOMIZADO - usePermissoes

```javascript
// Frontend - Hook para gerenciar permissões
import { useState, useEffect } from 'react';

function usePermissoes(menuId) {
  const [permissoes, setPermissoes] = useState({
    ver: false,
    criar: false,
    editar: false,
    deletar: false
  });
  
  const nivelId = localStorage.getItem('nivelId');
  
  useEffect(() => {
    async function carregarPermissoes() {
      try {
        const res = await fetch(`/menus/${menuId}/permissoes/${nivelId}`);
        const data = await res.json();
        
        if (data.sucesso) {
          setPermissoes(data.permissoes);
        }
      } catch (erro) {
        console.error('Erro:', erro);
      }
    }
    
    carregarPermissoes();
  }, [menuId, nivelId]);
  
  return permissoes;
}

// Usar em componentes
function ListaUsuarios() {
  const permissoes = usePermissoes(2); // 2 = Menu Usuários
  
  return (
    <div>
      {permissoes.criar && <button>Novo Usuário</button>}
      {permissoes.editar && <button>Editar</button>}
      {permissoes.deletar && <button>Deletar</button>}
    </div>
  );
}
```

### 8. INTERCEPTOR AXIOS PARA VALIDAÇÃO

```javascript
// Frontend - Interceptor para validar permissões antes de requisições
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Interceptor de resposta para tratamento de erros de permissão
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      alert('Você não tem permissão para essa ação');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 9. EXEMPLO COMPLETO - PÁGINA DE USUÁRIOS

```javascript
// Frontend - Página de Usuários com permissões
import React, { useState, useEffect } from 'react';

function PaginaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const permissoes = usePermissoes(2);
  const nivelId = localStorage.getItem('nivelId');
  
  // Carregar usuários
  useEffect(() => {
    carregarUsuarios();
  }, []);
  
  const carregarUsuarios = async () => {
    const res = await fetch('/auth/usuarios');
    const data = await res.json();
    setUsuarios(data.usuarios);
  };
  
  const criarUsuario = async (novoUsuario) => {
    if (!permissoes.criar) {
      alert('Sem permissão');
      return;
    }
    
    const res = await fetch('/auth/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario)
    });
    
    if (res.ok) {
      carregarUsuarios();
    }
  };
  
  const editarUsuario = async (id, dados) => {
    if (!permissoes.editar) {
      alert('Sem permissão');
      return;
    }
    
    const res = await fetch(`/auth/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    if (res.ok) {
      carregarUsuarios();
    }
  };
  
  const deletarUsuario = async (id) => {
    if (!permissoes.deletar) {
      alert('Sem permissão');
      return;
    }
    
    // Implementar delete
  };
  
  return (
    <div className="pagina-usuarios">
      <h1>Usuários</h1>
      
      {permissoes.criar && (
        <button onClick={() => criarUsuario({...})}>
          ➕ Novo Usuário
        </button>
      )}
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Nível</th>
            {(permissoes.editar || permissoes.deletar) && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.nivelNome}</td>
              <td>
                {permissoes.editar && <button>✏️</button>}
                {permissoes.deletar && <button>🗑️</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 📋 Checklist de Integração

- [ ] Implementar componente de Login
- [ ] Armazenar dados do usuário no localStorage
- [ ] Carregar menus baseado no nível
- [ ] Renderizar menu dinamicamente
- [ ] Validar permissões em ações
- [ ] Controlar visibilidade de botões
- [ ] Criar hooks customizados
- [ ] Implementar interceptors
- [ ] Testar com diferentes níveis
- [ ] Atualizar README com instruções

---

## 🎨 Design do Cabeçalho Sugerido

```html
<!-- Cabeçalho com cores em bloco único -->
<header class="erp-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div class="header-container">
    <div class="logo">
      <h1>ERP Syspro</h1>
    </div>
    
    <nav class="main-nav">
      <!-- Menus renderizados aqui dinamicamente -->
    </nav>
    
    <div class="user-menu">
      <span class="user-level" style="color: white; font-weight: bold;">
        👤 {{ nivelNome }}
      </span>
      <span class="user-name" style="color: white; margin-left: 10px;">
        {{ userName }}
      </span>
      <button class="logout-btn" style="background: white; color: #667eea; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Sair
      </button>
    </div>
  </div>
</header>

<style>
.erp-header {
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo h1 {
  color: white;
  margin: 0;
  font-size: 24px;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.main-nav a:hover {
  opacity: 0.8;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
```
