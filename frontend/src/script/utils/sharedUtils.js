/*FORMATAR VAlORES */

import { showLoading, hideLoading } from "./loadingUtils.js";

export async function setFormatMoney(varValue) {
  const valueAmount = document.getElementById("amount");
  let valor;

  if (varValue instanceof Event) {
    valor = varValue.target.value;
  } else if (varValue instanceof HTMLElement) {
    valor = varValue.value;
  }

  valor = valor.replace(/\D/g, "");

  valor = valor.replace(/(\d)(\d{2})$/, "$1,$2");

  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  valueAmount.value = "R$" + valor;
  hideLoading();
}

export async function LoadExpenses(monthIndex, yearIndex) {
  const monthForApi = monthIndex + 1;

  try {
    const response = await fetch(
      `/api/transactions/${monthForApi}/${yearIndex}`,
    );
    const transactions = await response.json();
    console.log(transactions[0]);
    const group_cards = document.getElementById("group_cards");

    if (group_cards) {
      group_cards.innerHTML = "";
    }

    console.log("★★" + transactions.length);
    console.log("★★" + transactions);

    transactions.forEach((cat) => {
      const item = document.createElement("article");

      item.classList.add("card_pay");

      const typeCategory = cat.type == "revenue" ? "Receita" : "Despesa";
      let convertAmount;

      if (cat.type == "expense") {
        convertAmount = Number(cat.amount)
          .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
          .replace("-R$", "- R$");
      } else {
        convertAmount =
          "+ " +
          Number(cat.amount).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
      }
      let statusTransaction;
      if (cat.status == "paid") {
        statusTransaction = "Pago";
      } else if (cat.status == "pending") {
        statusTransaction = "Pendente";
      } else {
        statusTransaction = "Receita";
      }

      item.innerHTML = `
      <div class="title_date">
        <strong class="title_category">${cat.name}</strong>
        <p id="dueDate${cat.transaction_id}"></p>
      </div>
      <div class="div_icon_category">
        <span
          class="material-symbols-outlined icon_category"
          id="icon_${cat.transaction_id}"
        > ${cat.icon}
        </span>
      </div>

      <div class="amount_circle">
        <strong class="amount_transaction"
          >${convertAmount}</strong
        >
        <div id="circle_${cat.transaction_id}" class="circle"></div>
      </div>

      <div class="card_text">
        <div class="text_transaction">
        <div class="status_type">
          <p class="status${statusTransaction} text_card"><strong>Status: </strong>${statusTransaction}</p>
          <p  class="text_card" ><strong>Tipo: </strong> ${typeCategory}</p>
        </div>
          <div class="description_payment">
          <p class="text_card" ><strong>Forma de Pag.: </strong>${cat.pmethod}</p>
          <p class="text_card" ><strong>Parcela: ???</strong></p>
          <p class="text_card" > <strong>Descrição: </strong>${cat.description}</p>
          </div>

        </div>
      </div>
      <div class="group_button_transactions index_card">
      

      <button  data-id="${cat.transaction_id}"  class="button_remove"><span class="material-symbols-outlined">
delete_forever
</span></button>
        <button data-id="${cat.transaction_id}"   class="button_edit edit_transaction"><span class="material-symbols-outlined">
edit_document
</span></button>
      </div>

`;

      async function renderTransactionButton(id) {
        const groupButton = item.querySelector(".group_button_transactions");
        const buttonPay = document.createElement("button");
        buttonPay.id = `transaction_${cat.transaction_id}`;
        buttonPay.dataset.id = cat.transaction_id;
        const res = await fetch(`/api/transactions/${id}/status`);

        const statusData = await res.json();
        const statusString = statusData.status || statusData;
        if (statusString == "paid") {
          buttonPay.classList.add(
            "button_set_status",
            "button_set_status_pending",
          );
          buttonPay.innerHTML = `<span class="material-symbols-outlined">
credit_card_off
</span>`;
        } else {
          buttonPay.classList.add(
            "button_set_status",
            "button_set_status_paid",
          );
          buttonPay.innerHTML = `<span class="material-symbols-outlined">
credit_score
</span>`;
        }
        groupButton.appendChild(buttonPay);
      }
      renderTransactionButton(cat.transaction_id);
      const iconSpan = item.querySelector(`#icon_${cat.transaction_id}`);
      const circle = item.querySelector(`#circle_${cat.transaction_id}`);

      if (iconSpan) {
        ("");
        iconSpan.style.backgroundColor = cat.color;
      }
      if (circle && cat.status === "paid") {
        circle.classList.add("circle_paid");
      } else if (circle && cat.status === "pending") {
        circle.classList.add("circle_pending");
      } else {
        circle.classList.add("circle_revenue");
      }

      if (group_cards) {
        group_cards.appendChild(item);
      }
      IsExpired(cat.due_date, cat.transaction_id, cat.type);
    });
  } catch (err) {
    console.error("Erro ao carregar Transações no Index", err);
  } finally {
    hideLoading();
  }
}

export function IsExpired(dueDate, id, type) {
  const [dia, mes, ano] = dueDate.split("/").map(Number);
  const formattedDueDate = new Date(ano, mes - 1, dia).getTime();

  const agora = Date.now(); // timestamp atual
  const elementDueDate = document.getElementById(`dueDate${id}`);

  if (type == "expense") {
    if (formattedDueDate < agora) {
      elementDueDate.classList.add("due_date_false");
      elementDueDate.textContent = `Data de vencimento: ${dueDate}`;
    } else {
      elementDueDate.classList.add("due_date_true");
      elementDueDate.textContent = `Data de vencimento: ${dueDate}`;
    }
  } else if (type == "revenue") {
    elementDueDate.classList.add("due_date_revenue");
    elementDueDate.textContent = `Data do pagamento: ${dueDate}`;
  }
}
