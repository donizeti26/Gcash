import {
  openModal,
  closeModal,
  setupModalGlobalListeners,
  overflowHidden,
} from "./modalUtils.js";
/*import { setupUI } from "./ui.js";*/
import { setupCalendar, setAtualMonth } from "./calendarUtils.js";
import {
  LoadDataAndEditTransaction,
  sendTransactionsEditions,
  setupTitleTransactionForm,
} from "./transactionsUtils.js";

import { openListCategory } from "./categoriesUtils.js";
import {
  loadPaymentMethodsRevenue,
  loadPaymentMethodsExpense,
  initExpensesForm,
  initTransactionForm,
  sumAtualMonthPaid,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
  sumAmountMonth,
} from "./formTransactionsUtils.js";
import { showLoading, hideLoading } from "./loadingUtils.js";
import {
  loadCategoryFormExpense,
  loadCategoryFormRevenue,
} from "./categoriesUtils.js";
import { testDisplay } from "./iconsUtils.js";
// INICIALIZAÇÕES GLOBAIS

setupCalendar();
setupModalGlobalListeners();

//BOTÃO CATEGORIA (ABRE LIST_CATEGORY.HTML E INICIALIZA CATEGORIAS + ICONS DE NEW CATEGORIA)

document.addEventListener("DOMContentLoaded", () => {
  showLoading();
  const btnExpense = document.getElementById("btn_expense");
  if (btnExpense) {
    btnExpense.addEventListener("click", async () => {
      await openModal("../views/form_transactions.html");

      const modal = document.querySelector("#new_modal_js");
      modal.dataset.formType = "expense";

      initTransactionForm?.();
      loadCategoryFormExpense?.();
      loadPaymentMethodsExpense?.();
      initExpensesForm?.();
      setAtualMonth();
      setupTitleTransactionForm("expense");

      const amount = document.getElementById("amount");

      amount.addEventListener("input", (event) => {
        setFormatMoney(event);
      });
    });
  }
});

const btnCategory = document.getElementById("btn_category");
if (btnCategory) {
  btnCategory.addEventListener("click", async () => {
    //ABRIR MODAL COM CATEGORIAS
    await openListCategory();
  });
}

const btnRevenue = document.getElementById("btn_revenue");
if (btnRevenue) {
  btnRevenue.addEventListener("click", async () => {
    await openModal("../views/form_transactions.html");
    //definindo que é um formulário de receitas
    const modal = document.querySelector("#new_modal_js");
    modal.dataset.formType = "revenue";

    setupTitleTransactionForm("revenue");

    //carregando
    initTransactionForm?.();
    initExpensesForm?.();
    loadCategoryFormRevenue?.();
    loadPaymentMethodsRevenue?.();

    setAtualMonth();

    amount.addEventListener("input", (event) => {
      setFormatMoney(event);
    });
  });
}

document.addEventListener("click", async (e) => {
  const { monthIndex, yearIndex } = getCurrentMonthYear();

  const buttonEdit = e.target.closest(".edit_transaction");
  if (buttonEdit) {
    const id = buttonEdit.dataset.id; // pegar direto do botão
    console.log("O botão clicado foi da transação", id);

    const categoryModal = await fetch(`/api/transactions/${id}/category`);
    const category = await categoryModal.json();

    showLoading();
    await openModal("../views/form_transactions.html");

    //definindo que é um formulário de receitas
    const modal = document.querySelector("#new_modal_js");

    //tenho que verificar se é expense ou revenue e depois setar typo

    document.getElementById("form_card").dataset.formType = id;

    try {
      const response = await fetch(`/api/transactions/${id}`);
      if (!response.ok) {
        console.error("Erro ao buscar transação:", response.status);
        return;
      }
      const transaction = await response.json();

      console.log("Dados da transação", transaction);
      if (!transaction || !transaction.due_date) {
        console.error("Transação inválida recebida:", transaction);
        return;
      }

      if (category.data.toString() === "expense") {
        console.log("FATO" + category.data);
        await loadCategoryFormExpense();
        await setupTitleTransactionForm("edit_expense");
        await loadPaymentMethodsExpense?.();
      } else if (category.data.toString() === "revenue") {
        await loadCategoryFormRevenue();
        await setupTitleTransactionForm("edit_revenue");
        await loadPaymentMethodsRevenue?.();
      }

      await initExpensesForm();
      LoadDataAndEditTransaction(transaction);
      sendTransactionsEditions();
    } catch (err) {
      console.error("Erro ao buscar transação", err);
    } finally {
      hideLoading();
    }
  }

  const buttonRemove = e.target.closest(".button_remove");
  if (buttonRemove) {
    const ConfirmStatus = await showConfirm({
      message: "Você quer realmente apagar essa transação?",
      theme: "danger",
    });

    if (!ConfirmStatus) {
      console.log(ConfirmStatus);
      console.log("EEEEEEEEE");
      return;
    }

    const id = buttonRemove.dataset.id; // pegar direto do botão
    console.log("O botão clicado foi da transação", id);

    try {
      showLoading();
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log(data.message);

      await sumAmountMonth(monthIndex, yearIndex);
      await sumAtualMonthPaid(monthIndex, yearIndex);
      await sumAmountMonthRevenue(monthIndex, yearIndex);
      await sumAtualMonthPending(monthIndex, yearIndex);
      await LoadExpenses(monthIndex, yearIndex);
    } catch (err) {
      console.error("Erro ao apagar: ", err);
    } finally {
      hideLoading();
    }
  }

  const buttonStatus = e.target.closest(".button_set_status");
  if (buttonStatus) {
    console.log("NUMERO DO MES::" + monthIndex);
    const id = buttonStatus.dataset.id;

    console.log("Mudando status da transação " + id);

    await SetStatusInTransactions(id);
    await sumAmountMonth(monthIndex, yearIndex);
    await sumAtualMonthPaid(monthIndex, yearIndex);
    await sumAmountMonthRevenue(monthIndex, yearIndex);
    await sumAtualMonthPending(monthIndex, yearIndex);
    await LoadExpenses(monthIndex, yearIndex);
  }
});

/*FORMATAR VAlORES */

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

///////////////////////////////////////////////////////////////////////
////////////ABRIR MODAL DE LISTA CATEGORIAS TELA INICIAL//////////////
/////////////////////////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  closeModal();
  await openListCategory();
});

////////////////////////////////////////////////////////////////////////////
/////////////////////Carregar despesas na tela inicial.//////////////////
//////////////////////////////////////////////////////////////////////////

export async function LoadExpenses(monthIndex, yearIndex) {
  const monthForApi = monthIndex + 1;

  try {
    const response = await fetch(
      `/api/transactions/${monthForApi}/${yearIndex}`
    );
    const transactions = await response.json();
    console.log(transactions[0]);
    const group_cards = document.getElementById("group_cards");

    if (group_cards) {
      group_cards.innerHTML = "";
    }
    transactions.forEach((cat) => {
      const item = document.createElement("article");

      item.classList.add("card_pay");

      const convertAmount = Number(cat.amount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      let statusTransaction;
      if (cat.status == "paid") {
        statusTransaction = "Pago";
      } else if (cat.status == "pending") {
        statusTransaction = "Pendente";
      } else {
        statusTransaction = "Receita";
      }

      const TYPECATEGORY = cat.type == "revenue" ? "Receita" : "Despesa";
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
        <div>

          <p class="status${statusTransaction}"><strong>Status:</strong>${statusTransaction}</p>
          <p> <strong>Tipo:</strong> ${TYPECATEGORY}</p>
          <p> <strong>Descrição: </strong>${cat.description}</p>
          <p><strong>Forma de Pagamento: </strong>${cat.pmethod}</p>
          <p><strong>Parcela: ???</strong></p>
        <p> <strong>Categoria: ${cat.name}</strong></p>


        </div>
      </div>
      <div class="group_button_transactions index_card">
      

      <button  data-id="${cat.transaction_id}"  class="button_remove">Remover</button>
        <button data-id="${cat.transaction_id}"   class="button_edit edit_transaction">Editar</button>
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
            "button_set_status_pending"
          );
          buttonPay.innerHTML = "Tornar pendente";
        } else {
          buttonPay.classList.add(
            "button_set_status",
            "button_set_status_paid"
          );
          buttonPay.innerHTML = "Pagar";
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

function IsExpired(dueDate, id, type) {
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

export function getCurrentMonthYear() {
  const monthEl = document.getElementById("month_index");
  const yearEl = document.getElementById("year_index");

  if (!monthEl || !yearEl) {
    console.warn("month_index ou year_index ainda não existem no DOM");
    return null;
  }

  return {
    monthIndex: Number(monthEl.dataset.id),
    yearIndex: Number(yearEl.dataset.id),
  };
}
const { monthIndex, yearIndex } = getCurrentMonthYear();

LoadExpenses(monthIndex, yearIndex);

///////////////////////////////////////////////////////////
////////pedindo para o back mudar o status/////////
//////////////////////////////////////////////////////////
export async function SetStatusInTransactions(id) {
  const { monthIndex, yearIndex } = getCurrentMonthYear();
  const ConfirmStatus = await showConfirm({
    message: "Você quer realmente alterar o status da transação?",
    theme: "warning",
  });

  if (!ConfirmStatus) {
    return;
  }

  try {
    showLoading();
    const currentStatus = await consultStatus(id);
    const statusString = currentStatus.status || currentStatus;
    const newStatus = statusString === "paid" ? "pending" : "paid";

    const response = await fetch(`/api/transactions/${id}/statusUpdate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar status");
    await LoadExpenses(monthIndex, yearIndex);
  } catch (err) {
    console.error("Erro ao atualizar status da transação" + err);
  } finally {
    hideLoading();
  }
}

export async function consultStatus(id) {
  try {
    const response = await fetch(`/api/transactions/${id}/status`);
    const status = await response.json(); // status agora é diretamente a string "paid" ou "pending"

    console.log("Status da transação", id, "é", status);
    return status;
  } catch (err) {
    console.error("Error ao consultar status: ", err.message);
    return null;
  }
}

////////////////////////////////////////////////////////
/////////APAGAR TRANSAÇÕES///////////////////
///////////////////////////////////////////////////

document.addEventListener("click", async (e) => {});

export function showConfirm({ message, theme }) {
  return new Promise((resolve) => {
    overflowHidden(true);

    const modal = document.getElementById("confirm_modal");
    const bodyModal = document.getElementById("body_modal");
    const iconModal = document.querySelector("#icon_modal");
    modal.className = "modal_box";
    modal.classList.add(theme);
    switch (theme) {
      case "danger":
        iconModal.textContent = "delete_forever";
        break;
      case "warning":
        iconModal.textContent = "notification_important";
        break;
    }

    const btnYes = modal.querySelector("#confirm_yes");
    modal.querySelector("#confirm_message").textContent = message;
    bodyModal.classList.remove("hidden");

    btnYes.onclick = () => {
      bodyModal.classList.add("hidden");
      resolve(true);
    };

    modal.querySelector("#confirm_no").onclick = () => {
      bodyModal.classList.add("hidden");
      resolve(false);
    };
  });
}
