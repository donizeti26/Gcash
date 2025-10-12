export function carregarDadosEditarTransacao(transaction) {
  const [dia, mes, ano] = transaction.due_date.split("/");
  const dataFormatada = `${ano}-${mes}-${dia}`;

  document.getElementById("category_id").value = transaction.category_id;
  document.getElementById("payment_method_id").value =
    transaction.payment_method_id;
  document.getElementById("due_date").value = dataFormatada;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("description").value = transaction.description;
  document.getElementById("status").value = transaction.status;
}
