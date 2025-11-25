export function setupTitleTransactionForm(type) {
  const title = document.querySelector("#page_title");

  if (!title) return;

  switch (type) {
    case "revenue":
      title.textContent = "Nova Receita";
      break;

    case "expense":
      title.textContent = "Nova Despesa";
      break;

    case "edit_revenue":
      title.textContent = "Editar Receita";
      break;

    case "edit_expense":
      title.textContent = "Editar Despesa";
      break;

    default:
      title.textContent = "Nova Transação";
  }
}
