/*FORMATAR VAlORES */

import { showLoading, hideLoading } from "./loadingUtils.js";
import { setNumCards } from "./index.search.js";
import { apiFetch } from "../api.js";

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
    const token = localStorage.getItem("token");
    const response = await apiFetch(
      `/transactions/${monthForApi}/${yearIndex}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const transactions = await response.json();
    console.log(transactions[0]);
    const group_cards = document.getElementById("group_cards");

    if (group_cards) {
      group_cards.innerHTML = "";
    }
    const totalPages = Math.ceil(transactions.length / 5);

    setNumCards({ total: transactions.length, currentPage: 1 });

    renderCards(transactions, 1);
    renderButtons(totalPages, 1);
    listenerButtons(transactions, 1, 5, totalPages);

    console.log("LINHA ACIMA EXECULTADA  𒉭" + transactions.length);
  } catch (err) {
    console.error("Erro ao carregar Transações no Index", err);
  } finally {
    hideLoading();
  }
}

export function listenerButtons(
  transactions,
  currentPage,
  perPage,
  totalPages,
) {
  const pagination = document.getElementById("pagination");

  pagination.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (!button) return;

    const page = Number(button.dataset.page);

    if (!page) return;

    currentPage = page;

    renderCards(transactions, currentPage, perPage);
    renderButtons(totalPages, currentPage);
    setNumCards({ total: transactions.length, currentPage: currentPage });
  });
}

export function renderButtons(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const ul = document.createElement("ul");

  const visiblePages = 5;
  const half = Math.floor(visiblePages / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = visiblePages;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - visiblePages + 1;
  }

  if (start < 1) start = 1;

  // BOTÃO ANTERIOR FIXO
  const liPrev = document.createElement("li");
  liPrev.innerHTML = `
    <button class="group_button_pages"
            data-page="${currentPage - 1}"
            ${currentPage === 1 ? "disabled" : ""}>
      «
    </button>`;
  ul.appendChild(liPrev);

  // BOTÕES NUMÉRICOS
  for (let i = start; i <= end; i++) {
    const li = document.createElement("li");
    if (currentPage == i) {
      li.id = "selected_page";
    }
    li.innerHTML = `
      <button class="group_button_pages ${currentPage === i ? "active" : ""}"
              data-page="${i}">
        ${i}
      </button>`;
    ul.appendChild(li);
  }

  // BOTÃO PRÓXIMO FIXO
  const liNext = document.createElement("li");
  liNext.innerHTML = `
    <button class="group_button_pages"
            data-page="${currentPage + 1}"
            ${currentPage === totalPages ? "disabled" : ""}>
      »
    </button>`;
  ul.appendChild(liNext);

  pagination.appendChild(ul);
}
export function renderCards(transactions, currentPage) {
  if (transactions.length == 0) {
    const groupCards = document.getElementById("group_cards");

    groupCards.innerHTML = `<p id="result_search">
    <img id="img_cant_find" src="/images/cant_find.svg">
    Nenhum resultado específico encontrado...</p>`;

    console.log(transactions.length + "AQUI MEU CHAAPAAAAAAAAAAA");
  } else {
    const perPage = 5;
    const groupCards = document.getElementById("group_cards");
    groupCards.innerHTML = "";
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const periodPage = transactions.slice(start, end);

    periodPage.forEach((cat) => {
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
      const id = cat.transaction_id;
      renderTransactionButton(id, item);
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
  }
}

async function renderTransactionButton(id, item) {
  const groupButton = item.querySelector(".group_button_transactions");
  const buttonPay = document.createElement("button");
  buttonPay.id = `transaction_${id}`;
  buttonPay.dataset.id = id;
  try {
    const token = localStorage.getItem("token");

    const res = await apiFetch(`/transactions/${id}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const statusData = await res.json();
    const statusString = statusData.status || statusData;
    if (statusString == "paid") {
      buttonPay.classList.add("button_set_status", "button_set_status_pending");
      buttonPay.innerHTML = `<span class="material-symbols-outlined">
credit_card_off
</span>`;
    } else {
      buttonPay.classList.add("button_set_status", "button_set_status_paid");
      buttonPay.innerHTML = `<span class="material-symbols-outlined">
credit_score
</span>`;
    }
  } catch (err) {
    console.error("Erro ao renderizar botao status", err);
  }
  groupButton.appendChild(buttonPay);
}

export function IsExpired(dueDate, id, type) {
  console.log("★★");
  console.log(dueDate);

  const [dia, mes, ano] = dueDate.split("/").map(Number);
  const formattedDueDate = new Date(ano, mes - 1, dia).getTime();

  const agora = Date.now(); // timestamp atual
  const elementDueDate = document.getElementById(`dueDate${id}`);

  if (type == "expense") {
    if (formattedDueDate < agora) {
      elementDueDate.classList.add("due_date_false");
      elementDueDate.textContent = `Data de vencimento: ${dueDate} `;
    } else {
      elementDueDate.classList.add("due_date_true");
      elementDueDate.textContent = `Data de vencimento: ${dueDate}`;
    }
  } else if (type == "revenue") {
    elementDueDate.classList.add("due_date_revenue");
    elementDueDate.textContent = `Data do pagamento: ${dueDate}`;
  }
}
