import { LoadExpenses, setFormatMoney } from "./sharedUtils.js";
import { showMonth } from "./calendarUtils.js";
import { closeModal, showToast } from "./modalUtils.js";

export function LoadDataAndEditTransaction(transaction) {
  console.log(
    "ID DA CATEGORIA DA TRANSAÇÃO: " + typeof transaction.category_id,
  );

  const [dia, mes, ano] = transaction.due_date.split("/");
  const dataFormatted = `${ano}-${mes}-${dia}`;
  const formCard = document.getElementById("form_card");

  formCard.dataset.formType = transaction.transaction_id;

  document.getElementById("category_id").value = String(
    transaction.category_id,
  );
  document.getElementById("payment_method_id").value = String(
    transaction.payment_method_id,
  );

  document.getElementById("due_date").value = dataFormatted;

  function setValueAmount() {
    const valueAmount = document.getElementById("amount");
    valueAmount.value = transaction.amount;
    setFormatMoney(valueAmount);
  }

  setValueAmount();

  document.getElementById("description").value = transaction.description;

  if (transaction.status === "paid") {
    document.getElementById("radio_response_paid").checked = true;
  } else {
    document.getElementById("radio_response_owing").checked = true;
  }

  const amount = document.getElementById("amount");

  amount.addEventListener("input", (event) => {
    setFormatMoney(event);
    console.log(event);
  });
}

export async function sendTransactionsEditions(type) {
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(".button_close_card");
      if (!btn) return;

      e.stopImmediatePropagation();
      e.preventDefault();

      closeModal();
    },
    true,
  );
  const form = document.getElementById("form_card");
  if (!form) return;

  // Adiciona o listener corretamente
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category_id = document.getElementById("category_id").value;
    const payment_method_id =
      document.getElementById("payment_method_id").value;
    const due_date = document.getElementById("due_date").value;
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const transaction_id = form.dataset.formType;

    const statusElement = document.querySelector(
      'input[name="response_status"]:checked',
    );
    const status = statusElement?.value || null;

    let amountNumber = amount
      .replace("R$", "") // remove somente o R$
      .replace(/\s/g, "") // remove espaços
      .replace(/\./g, "") // remove pontos de milhar
      .replace(",", "."); // troca vírgula por ponto

    amountNumber = parseFloat(amountNumber);
    console.log("AAAAAAAAAAAAAAAAAAAAA A " + amountNumber);
    if (type == "expense") {
      amountNumber = parseFloat(amountNumber) * -1;
    } else {
      amountNumber = parseFloat(amountNumber);
    }
    if (type == "expense" && amountNumber > 0) {
      alert("Valor não pode ser negativo");
      return;
    }
    try {
      await fetch(`/api/transactions/${transaction_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id,
          category_id,
          payment_method_id,
          due_date,
          amount: amountNumber,
          description,
          status,
          type,
        }),
      });
    } catch (err) {
      alert("Erro ao atualizar transação");
    } finally {
      const monthIndex = Number(
        document.getElementById("month_index").dataset.id,
      );
      const yearIndex = Number(
        document.getElementById("year_index").dataset.id,
      );

      await LoadExpenses(monthIndex, yearIndex);
      await showMonth();
      showToast("Operação concluída com Sucesso", 3000);

      closeModal(); // ← ISSO AGORA VAI RODAR!
    }
  });
}

export function setupTitleTransactionForm(type) {
  const title = document.querySelector("#page_title");
  const DataTransaction = document.querySelector("#data_transaction");
  if (!title) return;

  switch (type) {
    case "revenue":
      title.textContent = "Nova Receita";
      DataTransaction.textContent = "Data do Pagamento";
      break;

    case "expense":
      title.textContent = "Nova Despesa";
      break;

    case "edit_revenue":
      title.textContent = "Editar Receita";
      DataTransaction.textContent = "Data do Pagamento";

      break;

    case "edit_expense":
      title.textContent = "Editar Despesa";
      break;

    default:
      title.textContent = "Nova Transação";
  }
}

export async function countTransaction(month) {
  try {
    const response = await fetch(
      `/api/transactions/reports/count?month=${month}`,
    );
    const totalTransactions = await response.json();
    console.log("Total de transações: FDFDFD ", totalTransactions.total);
    return totalTransactions.total;
  } catch (err) {
    console.error("Erro ao contar transações", err);
  }
}
export async function insertCountTransaction(month) {
  console.log("Valor de MONT", month);
  const total = await countTransaction(month);

  const totalTransactions = document.getElementById("resultResume");
  const totalResult = document.createElement("p");

  if (total == 1) {
    totalResult.textContent = `${total} resultado`;
  } else {
    totalResult.textContent = `${total} resultados`;
  }
  totalTransactions.innerHTML = "";
  totalTransactions.appendChild(totalResult);
}
