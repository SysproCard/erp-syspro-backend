// Script simples para fazer cadastro de usuário

const dadosCadastro = {
  codigo: "USR001",
  nome: "Maria Silva",
  email: "maria.silva@empresa.com",
  senha: "senha123",
  nivel: 2,
  bloqueado: false,
  alteraPercentualPrestador: true,
  alteraLimiteUsuarios: true,
  efetuaCancelamentoBaixa: false,
  permiteExclusaoTransacoes: false,
  permiteAlteracaoSituacao: true,
  permiteEscolherLocalBaixa: false
};

console.log('=== CADASTRO DE NOVO USUÁRIO ===\n');
console.log('Enviando dados:');
console.log(JSON.stringify(dadosCadastro, null, 2));
console.log('\nAguardando resposta...\n');

fetch('http://localhost:3000/auth/cadastro', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dadosCadastro)
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
    console.log(`ID do novo usuário: ${data.usuario.id}`);
  } else {
    console.log('\n❌ ERRO NO CADASTRO:');
    console.log(`Mensagem: ${data.mensagem}`);
  }
})
.catch(err => {
  console.error('❌ Erro na requisição:', err.message);
});
