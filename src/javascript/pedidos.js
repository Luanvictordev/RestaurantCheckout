import { obterPedidos, atualizarStatusPedido } from './storage.js';

// Seleciona todas as colunas (.father) do HTML
const colunas = document.querySelectorAll('.father');

// Função simples para converter a ordem física da coluna em texto de status
function obterStatusDaColuna(indice) {
  if (indice === 0) {
    return 'confirmado';
  }
  if (indice === 1) {
    return 'preparacao';
  }
  if (indice === 2) {
    return 'motoqueiro';
  }
  if (indice === 3) {
    return 'rota';
  }
  if (indice === 4) {
    return 'entregue';
  }
  return '';
}

// Limpa os cards mockados antigos e redesenha a tela a partir do localStorage
function renderizarPedidos() {
  // Passa por todas as colunas para limpar os cards estáticos antigos
  for (let i = 0; i < colunas.length; i++) {
    const coluna = colunas[i];
    coluna.dataset.status = obterStatusDaColuna(i); // Salva o status da coluna na div
    
    // Busca todos os elementos <container> dentro desta coluna e remove
    const cardsAntigos = coluna.querySelectorAll('container');
    for (let j = 0; j < cardsAntigos.length; j++) {
      cardsAntigos[j].remove();
    }
  }

  // Pega a lista atualizada do localStorage
  const listaPedidos = obterPedidos();

  // Percorre todos os pedidos para criar e colocar os cards nas colunas certas
  for (let i = 0; i < listaPedidos.length; i++) {
    const pedido = listaPedidos[i];
    
    // Compara o status do pedido com o status de cada coluna para achar a correta
    for (let c = 0; c < colunas.length; c++) {
      const statusColuna = obterStatusDaColuna(c);
      
      if (pedido.status === statusColuna) {
        const colunaAlvo = colunas[c];
        const cardHtml = criarCardHtml(pedido);
        colunaAlvo.appendChild(cardHtml); // Coloca o card dentro da coluna HTML
      }
    }
  }
}

// Cria o elemento HTML do card respeitando o estilo original do CSS
function criarCardHtml(pedido) {
  const card = document.createElement('container');
  card.id = 'card';
  card.setAttribute('draggable', 'true'); // Permite que o card seja arrastável
  
  card.innerHTML = `
    <div class="kids">
        <p><strong>Pedido #${pedido.numeroDoPedido}</strong></p>
    </div>
    <div class="kids">
        <p>${pedido.nome}</p>
    </div>
    <div class="kids">
        <p>${pedido.valorDoPedido}</p>
    </div>
  `;

  // Evento disparado quando o usuário clica e começa a arrastar o card
  card.addEventListener('dragstart', function (event) {
    // Salva temporariamente o ID do pedido que está sendo movido
    event.dataTransfer.setData('text/plain', pedido.numeroDoPedido.toString());
    card.style.opacity = '0.4'; // Deixa transparente para dar feedback visual
  });

  // Evento disparado quando o usuário solta o card
  card.addEventListener('dragend', function () {
    card.style.opacity = '1'; // Devolve o visual normal do card
  });

  return card;
}

// Habilita todas as colunas para aceitarem receber os cards arrastados
for (let i = 0; i < colunas.length; i++) {
  const coluna = colunas[i];

  // Evento obrigatório do navegador para permitir soltar objetos na div
  coluna.addEventListener('dragover', function (event) {
    event.preventDefault(); // Remove o comportamento de bloqueio padrão
  });

  // Evento disparado quando o usuário solta o card em cima desta coluna
  coluna.addEventListener('drop', function (event) {
    event.preventDefault(); // Impede ações padrão do navegador
    
    // Recupera o ID do pedido que salvamos no dragstart
    const pedidoIdTexto = event.dataTransfer.getData('text/plain');
    const pedidoId = parseInt(pedidoIdTexto, 10);
    
    // Pega o status em texto atribuído a esta coluna
    const novoStatus = coluna.dataset.status;

    // Atualiza o localStorage e redesenha a tela atualizada
    atualizarStatusPedido(pedidoId, novoStatus);
    renderizarPedidos();
  });
}

// Inicializa a tela renderizando os pedidos existentes ao carregar
renderizarPedidos();
