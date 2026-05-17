// Pega os pedidos salvos no localStorage
export function obterPedidos() {
  const texto = localStorage.getItem('pedidos');
  
  // Se não existir nada salvo ainda, retorna uma lista vazia
  if (texto === null) {
    return [];
  }
  
  // Transforma o texto de volta em uma lista (array) de objetos
  return JSON.parse(texto);
}

// Salva um novo pedido no localStorage
export function salvarPedido(novoPedido) {
  const listaPedidos = obterPedidos();
  
  // Adiciona o novo pedido no final da lista
  listaPedidos.push(novoPedido);
  
  // Transforma a lista de objetos em texto para poder salvar no localStorage
  const listaEmTexto = JSON.stringify(listaPedidos);
  localStorage.setItem('pedidos', listaEmTexto);
}

// Atualiza o status (coluna) do pedido quando ele for arrastado
export function atualizarStatusPedido(numeroPedido, novoStatus) {
  const listaPedidos = obterPedidos();
  
  // Procura o pedido pelo número dele usando um loop tradicional
  for (let i = 0; i < listaPedidos.length; i++) {
    const pedido = listaPedidos[i];
    
    if (pedido.numeroDoPedido === numeroPedido) {
      pedido.status = novoStatus; // Atualiza o status (ex: 'preparacao')
      break; // Para o loop pois já encontrou o pedido
    }
  }
  
  // Salva a lista atualizada de volta no localStorage
  const listaEmTexto = JSON.stringify(listaPedidos);
  localStorage.setItem('pedidos', listaEmTexto);
}
