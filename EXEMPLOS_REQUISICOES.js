// ============================================
// EXEMPLOS DE REQUISIÇÕES - NOVO ERP
// ============================================

// 1️⃣ CRIAR NÍVEIS
console.log('=== 1. CRIAR NÍVEIS ===\n');

const niveis = [
  { nome: 'ADMIN', descricao: 'Administrador do sistema' },
  { nome: 'GERENTE', descricao: 'Gerente de operações' },
  { nome: 'SUPERVISOR', descricao: 'Supervisor de equipe' },
  { nome: 'OPERADOR', descricao: 'Operador de sistema' },
  { nome: 'LEITOR', descricao: 'Apenas leitura' }
];

niveis.forEach(nivel => {
  console.log(`\nPOST /niveis`);
  console.log(JSON.stringify(nivel, null, 2));
});

// 2️⃣ LISTAR NÍVEIS
console.log('\n\n=== 2. LISTAR NÍVEIS ===\n');
console.log('GET /niveis\n');
console.log('Resposta esperada: Array com todos os 5 níveis');

// 3️⃣ CRIAR MENUS
console.log('\n\n=== 3. CRIAR MENUS ===\n');

const menus = [
  {
    titulo: 'Dashboard',
    rota: '/dashboard',
    icon: 'chart-line',
    ordem: 1
  },
  {
    titulo: 'Usuários',
    rota: '/usuarios',
    icon: 'users',
    ordem: 2
  },
  {
    titulo: 'Níveis',
    rota: '/niveis',
    icon: 'shield',
    ordem: 3
  },
  {
    titulo: 'Menus',
    rota: '/menus',
    icon: 'bars',
    ordem: 4
  },
  {
    titulo: 'Relatórios',
    rota: '/relatorios',
    icon: 'file-alt',
    ordem: 5
  }
];

menus.forEach(menu => {
  console.log(`\nPOST /menus`);
  console.log(JSON.stringify(menu, null, 2));
});

// 4️⃣ ATRIBUIR PERMISSÕES - ADMIN
console.log('\n\n=== 4. ATRIBUIR PERMISSÕES - ADMIN ===\n');

console.log(`PUT /menus/1/permissoes/1  (Dashboard para ADMIN)`);
console.log(JSON.stringify({
  pode_ver: true,
  pode_criar: true,
  pode_editar: true,
  pode_deletar: true
}, null, 2));

console.log(`\nPUT /menus/2/permissoes/1  (Usuários para ADMIN)`);
console.log(JSON.stringify({
  pode_ver: true,
  pode_criar: true,
  pode_editar: true,
  pode_deletar: true
}, null, 2));

// 5️⃣ ATRIBUIR PERMISSÕES - GERENTE
console.log('\n\n=== 5. ATRIBUIR PERMISSÕES - GERENTE ===\n');

console.log(`PUT /menus/1/permissoes/2  (Dashboard para GERENTE)`);
console.log(JSON.stringify({
  pode_ver: true,
  pode_criar: false,
  pode_editar: false,
  pode_deletar: false
}, null, 2));

console.log(`\nPUT /menus/2/permissoes/2  (Usuários para GERENTE)`);
console.log(JSON.stringify({
  pode_ver: true,
  pode_criar: true,
  pode_editar: true,
  pode_deletar: false
}, null, 2));

// 6️⃣ ATRIBUIR PERMISSÕES - OPERADOR
console.log('\n\n=== 6. ATRIBUIR PERMISSÕES - OPERADOR ===\n');

console.log(`PUT /menus/1/permissoes/4  (Dashboard para OPERADOR)`);
console.log(JSON.stringify({
  pode_ver: true,
  pode_criar: false,
  pode_editar: false,
  pode_deletar: false
}, null, 2));

// 7️⃣ CADASTRAR USUÁRIO - ADMIN
console.log('\n\n=== 7. CADASTRAR USUÁRIO - ADMIN ===\n');

console.log(`POST /auth/cadastro`);
console.log(JSON.stringify({
  nome: 'Admin Sistema',
  email: 'admin@empresa.com',
  senha: 'senha123',
  nivelId: 1,
  bloqueado: false
}, null, 2));

// 8️⃣ CADASTRAR USUÁRIO - GERENTE
console.log('\n\n=== 8. CADASTRAR USUÁRIO - GERENTE ===\n');

console.log(`POST /auth/cadastro`);
console.log(JSON.stringify({
  nome: 'Gerente Operações',
  email: 'gerente@empresa.com',
  senha: 'senha456',
  nivelId: 2,
  bloqueado: false
}, null, 2));

// 9️⃣ CADASTRAR USUÁRIO - OPERADOR
console.log('\n\n=== 9. CADASTRAR USUÁRIO - OPERADOR ===\n');

console.log(`POST /auth/cadastro`);
console.log(JSON.stringify({
  nome: 'Operador João',
  email: 'joao@empresa.com',
  senha: 'senha789',
  nivelId: 4,
  bloqueado: false
}, null, 2));

// 🔟 LOGIN - ADMIN
console.log('\n\n=== 10. LOGIN - ADMIN ===\n');

console.log(`POST /auth/login`);
console.log(JSON.stringify({
  email: 'admin@empresa.com',
  senha: 'senha123'
}, null, 2));

console.log(`\nResposta esperada:`);
console.log(JSON.stringify({
  sucesso: true,
  mensagem: 'Login realizado com sucesso!',
  usuario: {
    id: 1,
    nome: 'Admin Sistema',
    email: 'admin@empresa.com',
    nivelId: 1,
    nivelNome: 'ADMIN',
    bloqueado: false,
    dataCriacao: '2026-04-27T10:00:00.000Z',
    dataAtualizacao: '2026-04-27T10:00:00.000Z'
  }
}, null, 2));

// 1️⃣1️⃣ OBTER MENUS DO NÍVEL - ADMIN
console.log('\n\n=== 11. OBTER MENUS DO NÍVEL - ADMIN ===\n');

console.log(`GET /menus/nivel/1`);
console.log(`\nResposta esperada: Todos os 5 menus com permissões completas`);

// 1️⃣2️⃣ OBTER MENUS DO NÍVEL - OPERADOR
console.log('\n\n=== 12. OBTER MENUS DO NÍVEL - OPERADOR ===\n');

console.log(`GET /menus/nivel/4`);
console.log(`\nResposta esperada: Apenas Dashboard com pode_ver=true`);

// 1️⃣3️⃣ OBTER NÍVEL COM MENUS
console.log('\n\n=== 13. OBTER NÍVEL COM MENUS ===\n');

console.log(`GET /niveis/1/menus`);
console.log(`\nResposta esperada:`);
console.log(JSON.stringify({
  id: 1,
  nome: 'ADMIN',
  descricao: 'Administrador do sistema',
  menus: [
    {
      id: 1,
      titulo: 'Dashboard',
      rota: '/dashboard',
      icon: 'chart-line',
      ordem: 1,
      permissoes: {
        ver: true,
        criar: true,
        editar: true,
        deletar: true
      }
    }
  ]
}, null, 2));

// 1️⃣4️⃣ ATUALIZAR USUÁRIO
console.log('\n\n=== 14. ATUALIZAR USUÁRIO ===\n');

console.log(`PUT /auth/usuarios/2`);
console.log(JSON.stringify({
  nome: 'Gerente Atualizado',
  nivelId: 2,
  bloqueado: false
}, null, 2));

// 1️⃣5️⃣ LISTAR TODOS OS USUÁRIOS
console.log('\n\n=== 15. LISTAR TODOS OS USUÁRIOS ===\n');

console.log(`GET /auth/usuarios`);
console.log(`\nResposta esperada: Array com usuários e seus níveis`);

console.log('\n\n' + '='.repeat(50));
console.log('✅ Exemplos de requisições para testar o novo ERP');
console.log('='.repeat(50));
