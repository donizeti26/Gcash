import { LoadExpenses, setFormatMoney } from "./index.js";
import { showMonth } from "./calendar.js";
import { closeModal } from "./modal.js";

export function LoadDataAndEditTransaction(transaction) {
  console.log(
    "ID DA CATEGORIA DA TRANSACAO: " + typeof transaction.category_id
  );

  const [dia, mes, ano] = transaction.due_date.split("/");
  const dataFormatted = `${ano}-${mes}-${dia}`;
  const formCard = document.getElementById("form_card");

  formCard.dataset.formType = transaction.transaction_id;

  document.getElementById("category_id").value = String(
    transaction.category_id
  );
  document.getElementById("payment_method_id").value = String(
    transaction.payment_method_id
  );

  document.getElementById("due_date").value = dataFormatted;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("description").value = transaction.description;
  if (transaction.status === "paid") {
    document.getElementById("radio_response_paid").checked = true;
  } else {
    document.getElementById("radio_response_owing").checked = true;
  }

  const amount = document.getElementById("amount");

  amount.addEventListener("input", (event) => {
    setFormatMoney(event);
  });
}

export async function sendTransactionsEditions() {
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(".button_close_card");
      if (!btn) return;

      e.stopImmediatePropagation();
      e.preventDefault();

      closeModal();
    },
    true
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
      'input[name="response_status"]:checked'
    );
    const status = statusElement?.value || null;

    let amountNumber = amount.replace(/[R$.]/g, "").replace(",", ".");
    amountNumber = parseFloat(amountNumber);

    try {
      await fetch(`/api/transactions/updatetransactions/${transaction_id}`, {
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
        }),
      });
    } catch (err) {
      alert("Erro ao atualizar transação");
    } finally {
      const monthIndex = Number(
        document.getElementById("month_index").dataset.id
      );
      const yearIndex = Number(
        document.getElementById("year_index").dataset.id
      );

      await LoadExpenses(monthIndex, yearIndex);
      await showMonth();

      closeModal(); // ← ISSO AGORA VAI RODAR!
    }
  });
}
