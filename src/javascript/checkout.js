import { obterPedidos, salvarPedido } from './storage.js';

// Cria as listas de pedidos e as variáveis de controle
const pedidosPendentes = [];
const pedidosEmProducao = [];
const pedidosFinalizados = [];

// Define o número do próximo ID com base no tamanho da lista de pedidos salvos
let listaDePedidos = obterPedidos();
let ultimoId = listaDePedidos.length;

let pedidoAtual = null;
let valorDoTroco = null;

// Exibe o número do primeiro pedido na tela principal
const numeroPedidoLanding = document.getElementById('numero-do-pedido-landing');
numeroPedidoLanding.textContent = "Pedido# " + (ultimoId + 1);

// Função simples para atualizar o número do pedido exibido na tela
function atualizarNumeroPedido() {
  const elemento = document.getElementById('numero-do-pedido-landing');
  elemento.textContent = "Pedido# " + (ultimoId + 1);
}

// Função para esconder o modal de confirmação
function fecharModalDeConfirmacaoDePedido() {
  const modal = document.getElementById('modalDeConfirmacaoDePedido');
  modal.style.display = 'none';
}

// Dispara quando o formulário é enviado (submit)
function finalizarPedido(event) {
  event.preventDefault(); // Impede que a página recarregue ao enviar o formulário
  
  const nome = document.getElementById('nome-cliente').value;
  const telefone = document.getElementById('fone-cliente').value;
  const endereco = document.getElementById('endereco-cliente').value;
  const pedidoCliente = document.getElementById('pedido-cliente').value;
  const valorDoPedido = document.getElementById('valor-pedido').value;
  const valorDoTrocoInput = document.getElementById('troco').value;
  const formaDePagamento = document.getElementById('pagamento').value;
  
  // Monta o objeto do pedido com todas as informações
  const pedido = {
    nome: nome,
    telefone: telefone,
    endereco: endereco,
    pedidoCliente: pedidoCliente,
    valorDoPedido: valorDoPedido,
    valorDoTroco: valorDoTrocoInput,
    formaDePagamento: formaDePagamento,
    numeroDoPedido: ultimoId + 1,
    status: 'confirmado', // status inicial para o quadro de pedidos
    horarioEmitido: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
  
  pedidoAtual = pedido;
  atualizarNumeroPedido();
  exibirModalDeConfirmacaoDePedido(pedido);
}

// Insere os dados do pedido dentro dos elementos do modal
function exibirModalDeConfirmacaoDePedido(pedido) {
  document.getElementById('nome-cliente-modal').textContent = pedido.nome;
  document.getElementById('fone-cliente-modal').textContent = pedido.telefone;
  document.getElementById('endereco-cliente-modal').textContent = pedido.endereco;
  document.getElementById('pedido-cliente-modal').textContent = pedido.pedidoCliente;
  document.getElementById('valor-pedido-modal').textContent = pedido.valorDoPedido;
  document.getElementById('pagamento-modal').textContent = pedido.formaDePagamento;
  
  // Se o campo troco tiver algum valor digitado, mostra ele no modal
  if (pedido.valorDoTroco && pedido.valorDoTroco !== 'R$ 0,00' && pedido.valorDoTroco !== 'R$ 0,00') {
    document.getElementById('troco-modal').textContent = pedido.valorDoTroco;
  } else {
    document.getElementById('troco-modal').textContent = 'Sem troco';
  }
  
  document.getElementById('numero-do-pedido-modal').textContent = pedido.numeroDoPedido;
  
  // Torna o modal visível na tela
  const modal = document.getElementById('modalDeConfirmacaoDePedido');
  modal.style.display = 'block';
}

// Salva o pedido finalizado no localStorage e limpa a tela
function confirmarPedido() {
  if (pedidoAtual !== null) {
    // Salva o pedido usando a nossa função criada no storage.js
    salvarPedido(pedidoAtual);
    
    // Atualiza a contagem dos IDs com a nova lista salva
    const listaAtualizada = obterPedidos();
    ultimoId = listaAtualizada.length;
    
    pedidoAtual = null;
  }
  
  fecharModalDeConfirmacaoDePedido();
  limparFormulario();
  atualizarNumeroPedido();
}

// Reseta todos os inputs do formulário
function limparFormulario() {
  document.getElementById('pedido-cliente').value = '';
  document.getElementById('valor-pedido').value = '';
  document.getElementById('pagamento').value = '';
  document.getElementById('troco').value = '';
  document.getElementById('nome-cliente').value = '';
  document.getElementById('fone-cliente').value = '';
  document.getElementById('endereco-cliente').value = '';
}

// Lógica de exibir ou esconder o input de troco
const selectPagamento = document.getElementById('pagamento');
const campoTroco = document.getElementById('troco');

campoTroco.style.display = 'none';

selectPagamento.addEventListener('change', function () {
  if (selectPagamento.value === 'troco') {
    campoTroco.style.display = 'flex';
  } else {
    campoTroco.style.display = 'none';
  }
});

// ==========================================
// MÁSCARAS DE ENTRADA (MÁSCARAS DE INPUT)
// ==========================================

// Formata o telefone dinamicamente no padrão (XX) XXXXX-XXXX
function aplicarMascaraTelefone(event) {
  const input = event.target;
  let valor = input.value;
  
  // Limpa tudo que não for número
  valor = valor.replace(/\D/g, '');
  
  if (valor.length === 0) {
    input.value = "";
    return;
  }
  
  // Vai fatiando e formatando o telefone conforme digita
  if (valor.length <= 2) {
    input.value = "(" + valor;
  } 
  else if (valor.length <= 6) {
    input.value = "(" + valor.substring(0, 2) + ") " + valor.substring(2);
  } 
  else if (valor.length <= 10) {
    input.value = "(" + valor.substring(0, 2) + ") " + valor.substring(2, 6) + "-" + valor.substring(6);
  } 
  else {
    input.value = "(" + valor.substring(0, 2) + ") " + valor.substring(2, 7) + "-" + valor.substring(7, 11);
  }
}

// Formata a moeda dinamicamente no padrão R$ XX,XX (da direita para a esquerda)
function aplicarMascaraMoeda(event) {
  const input = event.target;
  let valor = input.value;
  
  // Limpa tudo o que não for número
  valor = valor.replace(/\D/g, '');
  
  if (valor === '') {
    valor = '0';
  }
  
  // Transforma em decimal (divide por 100)
  const valorNumerico = parseFloat(valor) / 100;
  
  // Formata no padrão de Real brasileiro R$ 0,00
  const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  input.value = valorFormatado;
}

// Captura os inputs para aplicar as máscaras
const inputTelefone = document.getElementById('fone-cliente');
const inputValor = document.getElementById('valor-pedido');
const inputTroco = document.getElementById('troco');

// Atribui os ouvintes ao evento de input (teclado)
inputTelefone.addEventListener('input', aplicarMascaraTelefone);
inputValor.addEventListener('input', aplicarMascaraMoeda);
inputTroco.addEventListener('input', aplicarMascaraMoeda);

// Vincula as funções ao escopo global (window) para o HTML conseguir chamá-las nos eventos onclick/onsubmit
window.finalizarPedido = finalizarPedido;
window.confirmarPedido = confirmarPedido;
window.fecharModalDeConfirmacaoDePedido = fecharModalDeConfirmacaoDePedido;
