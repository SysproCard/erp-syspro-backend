// Script para fazer cadastro com email novo

const usuario = {
  codigo: "USR100",
  nome: "Carlos Mendonça",
  email: "carlos.mendonca@empresa.com",  // Email novo (diferente)
  senha: "senha999",
  nivel: 3,
  bloqueado: false,
  alteraPercentualPrestador: true,
  alteraLimiteUsuarios: false,
  efetuaCancelamentoBaixa: true,
  permiteExclusaoTransacoes: false,
  permiteAlteracaoSituacao: true,
  permiteEscolherLocalBaixa: true
};

console.log('=== CADASTRO COM EMAIL NOVO ===\n');
console.log('Dados a cadastrar:');
console.log(JSON.stringify(usuario, null, 2));
console.log('\nEnviando para: http://localhost:3000/auth/cadastro\n');

fetch('http://localhost:3000/auth/cadastro', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(usuario)
})
.then(res => {
  console.log(`Status: ${res.status}`);
  return res.json();
})
.then(data => {
  console.log('\n=== RESPOSTA ===\n');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.sucesso) {
    console.log('\n✅ CADASTRO REALIZADO COM SUCESSO!');
    console.log(`\nDados do novo usuário:`);
    console.log(`  ID: ${data.usuario.id}`);
    console.log(`  Código: ${data.usuario.codigo}`);
    console.log(`  Nome: ${data.usuario.nome}`);
    console.log(`  Email: ${data.usuario.email}`);
    console.log(`  Nível: ${data.usuario.nivel}`);
  } else {
    console.log('\n❌ ERRO:');
    console.log(`  ${data.mensagem}`);
  }
})
.catch(err => {
  console.error('❌ Erro na requisição:', err.message);
});
