import {
  openModal,
  closeModal,
  setupModalGlobalListeners,
  overflowHidden,
  showToast,
} from "./modalUtils.js";
import { LoadExpenses, setFormatMoney } from "./sharedUtils.js";
/*import { setupUI } from "./ui.js";*/
import { setupCalendar, setAtualMonth } from "./calendarUtils.js";
import {
  LoadDataAndEditTransaction,
  sendTransactionsEditions,
  setupTitleTransactionForm,
  insertCountTransaction,
} from "./transactionsUtils.js";

import {
  loadPaymentMethodsRevenue,
  loadPaymentMethodsExpense,
  initExpensesForm,
  initTransactionForm,
  sumAtualMonthPaid,
  resumeMonthInsert,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
  sumAmountYear,
} from "./formTransactionsUtils.js";
import { showLoading, hideLoading } from "./loadingUtils.js";
import {
  loadCategoryFormExpense,
  openListCategory,
  loadCategoryFormRevenue,
} from "./categoriesUtils.js";

// INICIALIZAÇÕES GLOBAIS

setupCalendar();
setupModalGlobalListeners();

//BOTÃO CATEGORIA (ABRE LIST_CATEGORY.HTML E INICIALIZA CATEGORIAS + ICONS DE NEW CATEGORIA)

document.addEventListener("DOMContentLoaded", async () => {
  showLoading();
  insertCountTransaction();
  const btnExpense = document.getElementById("btn_expense");
  if (btnExpense) {
    btnExpense.addEventListener("click", async () => {
      await openModal("../views/form_transactions.html");

      const modal = document.querySelector("#new_modal_js");
      modal.dataset.formType = "expense";

      initTransactionForm?.("expense");
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
    initTransactionForm?.("revenue");
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
        console.log("FATO " + category.data);
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
      message: "Você realmente quer excluir essa transação?",
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

      await sumAmountYear(monthIndex, yearIndex);
      await sumAtualMonthPaid(monthIndex, yearIndex);
      await resumeMonthInsert(monthIndex, yearIndex);
      await sumAmountMonthRevenue(monthIndex, yearIndex);
      await sumAtualMonthPending(monthIndex, yearIndex);
      await LoadExpenses(monthIndex, yearIndex);
      await insertCountTransaction(monthIndex);
    } catch (err) {
      console.error("Erro ao apagar: ", err);
    } finally {
      hideLoading();
      showToast("Operação concluída com Sucesso", 3000);
    }
  }

  const buttonStatus = e.target.closest(".button_set_status");
  if (buttonStatus) {
    console.log("NUMERO DO MES::" + monthIndex);
    const id = buttonStatus.dataset.id;

    console.log("Mudando status da transação " + id);

    await SetStatusInTransactions(id);
    await sumAmountYear(monthIndex, yearIndex);
    await sumAtualMonthPaid(monthIndex, yearIndex);
    await resumeMonthInsert(monthIndex, yearIndex);
    await sumAmountMonthRevenue(monthIndex, yearIndex);
    await sumAtualMonthPending(monthIndex, yearIndex);
    await LoadExpenses(monthIndex, yearIndex);
    await insertCountTransaction(monthIndex);
    hideLoading();
    showToast("Operação concluída com Sucesso", 3000);
  }
});

///////////////////////////////////////////////////////////////////////
////////////ABRIR MODAL DE LISTA CATEGORIAS TELA INICIAL//////////////
/////////////////////////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  closeModal();
  await openListCategory();
});

///////////////////////////////////////////////////////////////////////
////////////INICIAR FORMULÁRIO DE PESQUISA  //////////////////////////
/////////////////////////////////////////////////////////////////////
initSearchArea();
export async function initSearchArea() {
  console.log("DF FUNCIONANDO");
  const type = document.getElementById("search_description");
  const InputCategory = document.getElementById("search_category");

  async function searchLoadCategories(typeValue) {
    try {
      const response = await fetch(`/api/categories?type=${typeValue}`);
      const listCategory = await response.json();
      return listCategory;
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  }

  if (type.value) {
    console.log("DF FUNCIONANDO");
    const listCategories = await searchLoadCategories(type.value);
    InputCategory.innerHTML = `<option value="all" selected="">Todas as categorias...</option>`;
    listCategories.forEach((cat) => {
      const item = document.createElement("option");
      item.innerHTML = `${cat.name}`;
      if (InputCategory) {
        InputCategory.appendChild(item);
      }
    });
  }

  type.addEventListener("change", async (event) => {
    searchLoadCategories(event.target.value);
    console.log("DF FUNCIONANDO");
    const listCategories = await searchLoadCategories(type.value);
    InputCategory.innerHTML = `<option value="all" selected="">Todas as categorias...</option>`;
    listCategories.forEach((cat) => {
      const item = document.createElement("option");
      item.innerHTML = `${cat.name}`;
      if (InputCategory) {
        InputCategory.appendChild(item);
      }
    });
  });
}

////////////////////////////////////////////////////////////////////////////
/////////////////////Carregar despesas na tela inicial.//////////////////
//////////////////////////////////////////////////////////////////////////

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
    const ConfirmTitle = document.getElementById("confirm_title");
    const bodyModal = document.getElementById("body_modal");
    const buttonConfirm = document.getElementById("confirm_yes");
    const iconModal = document.querySelector("#icon_modal");

    modal.classList.remove("*");

    modal.className = "modal_box";
    modal.classList.add(theme);
    buttonConfirm.classList.add(theme);
    iconModal.classList.add(theme);

    switch (theme) {
      case "danger":
        iconModal.classList.remove("warning");
        buttonConfirm.classList.remove("warning");
        iconModal.textContent = "delete_forever";
        ConfirmTitle.textContent = "Deletar Transação";
        buttonConfirm.textContent = "Sim, Deletar.";
        break;
      case "warning":
        iconModal.classList.remove("danger");
        buttonConfirm.classList.remove("danger");
        iconModal.textContent = "compare_arrows";
        ConfirmTitle.textContent = "Alterar Status";
        buttonConfirm.textContent = "Sim, Alterar.";
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

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        bodyModal.classList.add("hidden");
        resolve(false);
      }
    });
  });
}
