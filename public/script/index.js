import { openModal, closeModal, setupModalGlobalListeners } from "./modal.js";
/*import { setupUI } from "./ui.js";*/
import { setupCalendar, setAtualMonth } from "./calendar.js";
import { LoadDataAndEditTransaction } from "./edit_transactions.js";
import { loadCategories, sendCategoryNewCategory } from "./form_expenses.js";
import {
  loadCategoryForm,
  loadPaymentMethodsRevenue,
  loadPaymentMethodsExpense,
  initExpensesForm,
  initTransactionForm,
  sumAtualMonthPaid,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
  sumAmountMonth,
} from "./installments.js";
import { showLoading, hideLoading } from "./utils.js";
import { setupTransactionForm } from "./form_transactions.js";
import { loadCategoryFormRevenue } from "./form_revenue.js";
import { create_icons, testDisplay } from "./icons.js";
// INICIALIZAÇÕES GLOBAIS

setupCalendar();
setupModalGlobalListeners();

/////////////////////////////////////////////////////
////////////INICIAR FORM TRANSAÇÕES//////////////
////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  // BOTÃO PARA ABRIR DESPESAS (E INICIALIZAR INSTALLMENTS)
  showLoading();
  const btnExpense = document.getElementById("btn_expense");
  if (btnExpense) {
    btnExpense.addEventListener("click", async () => {
      //ABRIR MODAL COM HTML DE DESPESAS
      //DEPOIS QUE O HTML É INJETADO, INICIALIZA A LÓGICA DAS PARCELAS
      await openModal("../views/form_transactions.html");

      const modal = document.querySelector("#new_modal_js");
      modal.dataset.formType = "expense";

      initTransactionForm?.();
      loadCategoryForm?.();
      loadPaymentMethodsExpense?.();
      initExpensesForm?.();
      setAtualMonth();
      setupTransactionForm();

      const amount = document.getElementById("amount");

      amount.addEventListener("input", (event) => {
        setFormatMoney(event);
      });
    });
  }
});

//BOTÃO CATEGORIA (ABRE O FORM_CATEGORIAS HTML E INICIALIZA CATEGORIAS + ICONS DE NEW CATEGORIA)
const btnCategory = document.getElementById("btn_category");

if (btnCategory) {
  btnCategory.addEventListener("click", async () => {
    //ABRIR MODAL COM CATEGORIAS
    await abrirCategorias();
  });
}

async function setFormatMoney(event) {
  let valor = event.target.value;
  valor = valor.replace(/\D/g, "");

  valor = valor.replace(/(\d)(\d{2})$/, "$1,$2");

  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  event.target.value = "R$" + valor;
  hideLoading();
}

/////////////////////////////////////////////////////////
////////////INICIAR FORM REVENUE//////////////
////////////////////////////////////////////////////////
const btnRevenue = document.getElementById("btn_revenue");
if (btnRevenue) {
  btnRevenue.addEventListener("click", async () => {
    await openModal("../views/form_transactions.html");
    //definindo que é um formulário de receitas
    const modal = document.querySelector("#new_modal_js");
    modal.dataset.formType = "revenue";

    setupTransactionForm();

    //carregando
    initTransactionForm?.();
    initExpensesForm?.();
    loadCategoryFormRevenue?.();
    loadPaymentMethodsRevenue?.();
    loadPaymentMethodsExpense?.();

    setAtualMonth();

    amount.addEventListener("input", (event) => {
      setFormatMoney(event);
    });
  });
}

///////////////////////////////////////////////////////////////
/////////FORM EDITAR TRANSACOES///////////////////
///////////////////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".edit_transaction");
  if (!button) return;

  const id = button.dataset.id; // pegar direto do botão
  console.log("O botão clicado foi da transação", id);
  showLoading();
  await openModal("../views/form_transactions.html");
  //definindo que é um formulário de receitas
  const modal = document.querySelector("#new_modal_js");

  //tenho que verificar se é expense ou revenue e depois setar typo
  modal.dataset.formType = "edit_expense";

  try {
    const response = await fetch(`/api/transactions/transactions/${id}`);
    if (!response.ok) {
      console.error("Erro ao buscar transação:", response.status);
      return;
    }
    const transaction = await response.json();
    console.log("Dados da transacao", transaction);
    if (!transaction || !transaction.due_date) {
      console.error("Transação inválida recebida:", transaction);
      return;
    }

    await loadCategoryForm();
    await loadPaymentMethodsExpense?.();

    await initExpensesForm();
    LoadDataAndEditTransaction(transaction);
    setupTransactionForm();
  } catch (err) {
    console.error("Erro ao buscar transação", err);
  } finally {
    hideLoading();
  }
});

///////////////////////////////////////////////////////////////
////////////INICIAR LISTA DE CATEGORIAS//////////////
/////////////////////////////////////////////////////////
async function abrirCategorias() {
  showLoading();
  await openModal("../views/form_categories.html");

  loadCategories?.();

  const btnNewCategory = document.getElementById("button_category");

  if (btnNewCategory && !btnNewCategory.dataset.listenerAdded) {
    btnNewCategory.addEventListener("click", async () => {
      await abrirNovaCategoria();
    });

    btnNewCategory.dataset.listenerAdded = "true";
    hideLoading();
  }
}

async function abrirNovaCategoria() {
  await openModal("../views/new_category.html");

  sendCategoryNewCategory?.();
}

document.addEventListener("click", async (e) => {
  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  closeModal();
  await abrirCategorias();
});

////////////////////////////////////////////////////////////////////////////
/////////////////////Carregar despesas na tela inicial.//////////////////
//////////////////////////////////////////////////////////////////////////

export async function LoadExpenses(monthIndex, year_index) {
  console.log("-LOADEXPENSES-");
  const monthForApi = monthIndex + 1;
  showLoading();
  try {
    const response = await fetch(
      `/api/transactions/transactionsGet/${monthForApi}/${year_index}`
    );
    const transactions = await response.json();

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

      item.innerHTML = `
      <div class="title_date">
        <strong class="title_category">${cat.name}</strong>
        <p>${cat.due_date}</p>
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
          <p><strong>Parcela:</strong> 1/1</p>
          <p><strong>Forma de Pagamento: </strong>${cat.pmethod}</p>
          <p><strong>Status: </strong>${statusTransaction}</p>
          <p> <strong>Descrição: </strong>${cat.description}
          </p>
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
        console.log("ID da transação:", id);
        const res = await fetch(`/api/transactions/transactions/${id}/status`);
        const statusData = await res.json();
        if (statusData == "paid") {
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
    });
  } catch (err) {
    console.error("Erro ao carregar Transações no Index", err);
  } finally {
    hideLoading();
  }
}
const month = document.getElementById("month_index");
const year = document.getElementById("year_index");
const monthIndex = Number(month.dataset.id);
const year_index = Number(year.dataset.id);

LoadExpenses(monthIndex, year_index);

////////////////////////////////////////////////////////////////////
/////////ALTERAR STATUS TRANSACOES//////////////////////
/////////////////////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".button_set_status");

  if (!button) return;

  const id = button.dataset.id;

  console.log("Mudando status da transação " + id);

  await SetStatusInTransactions(id);
  await sumAmountMonth(monthIndex, year_index);
  await sumAtualMonthPaid(monthIndex, year_index);
  await sumAmountMonthRevenue(monthIndex, year_index);
  await sumAtualMonthPending(monthIndex, year_index);
  await LoadExpenses(monthIndex, year_index);
});

///////////////////////////////////////////////////////////
////////pedindo para o back mudar o status/////////
//////////////////////////////////////////////////////////
export async function SetStatusInTransactions(id) {
  const ConfirmStatus = confirm("Você quer realmente mudar o status?");

  if (!ConfirmStatus) {
    alert("Você cancelou a mudança de status.");
    return;
  }
  showLoading();
  try {
    const status = await consultStatus(id);
    const newStatus = status === "paid" ? "pending" : "paid";

    const response = await fetch(
      `/api/transactions/transactions/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    if (!response.ok) throw new Error("Erro ao atualizar status");
    await LoadExpenses();
  } catch (err) {
    console.error("Erro ao atualizar status da transação" + err);
  } finally {
    hideLoading();
  }
}

export async function consultStatus(id) {
  try {
    const response = await fetch(`/api/transactions/transactions/${id}/status`);
    const status = await response.json(); // status agora é diretamente a string "paid" ou "pending"

    console.log("Status da transação", id, "é", status);
    return status;
  } catch (err) {
    console.error("Error ao consultar status: ", err.message);
    return null;
  }
}

////////////////////////////////////////////////////////
/////////APAGAR TRANSACOES///////////////////
///////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".button_remove");
  if (!button) return;

  const ConfirmStatus = confirm("Você quer realmente apagar essa transação?");

  if (!ConfirmStatus) {
    alert("Você cancelou a operação.");
    return;
  }
  const id = button.dataset.id; // pegar direto do botão
  console.log("O botão clicado foi da transação", id);

  try {
    const response = await fetch(`api/transactions/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data.message);
    await SetStatusInTransactions(id);
    await sumAmountMonth(monthIndex, year_index);
    await sumAtualMonthPaid(monthIndex, year_index);
    await sumAmountMonthRevenue(monthIndex, year_index);
    await sumAtualMonthPending(monthIndex, year_index);
    await LoadExpenses(monthIndex, year_index);
  } catch (err) {
    console.error("Erro ao apagar: ", err);
  }
});
