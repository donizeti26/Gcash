export function setupTransactionForm() {
  const modal = document.querySelector("#new_modal_js");
  const type = modal.dataset.formType;

  const title = document.querySelector("#page_title");
  const paymentDiv = document
    .querySelector("#payment_method_id")
    ?.closest("div");

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
