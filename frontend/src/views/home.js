import "../css/style.css";

import { renderFormTransaction } from "./form_transaction.js";
import {
  closeModal,
  setupModalGlobalListeners,
  overflowHidden,
  showToast,
} from "../script/utils/modalUtils.js";
import { showConfirm } from "../script/index.logic.js";
import { getCurrentMonthYear } from "../script/index.logic.js";

import { LoadExpenses, setFormatMoney } from "../script/utils/sharedUtils.js";
import { setupCalendar, setAtualMonth } from "../script/utils/calendarUtils.js";

import {
  LoadDataAndEditTransaction,
  sendTransactionsEditions,
  setupTitleTransactionForm,
  insertCountTransaction,
} from "../script/utils/transactionsUtils.js";

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
} from "../script/utils/formTransactionsUtils.js";

import { showLoading, hideLoading } from "../script/utils/loadingUtils.js";

import {
  loadCategoryFormExpense,
  openListCategory,
  loadCategoryFormRevenue,
} from "../script/utils/categoriesUtils.js";

import Litepicker from "litepicker";

/*=================
===================
      RENDER
===================
=================== */

export function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = `    <div id="main_content">
      <div id="menu_mobile"></div>
      <div id="left_side">
        <div id="user">
          <p>Claudio CTE 01</p>
        </div>
        <article id="resume_month">
          <div id="aside_menu">
            <span id="atual_month">
              <button id="BACK" type="button" class="button_month">
                <span class="material-symbols-outlined arrow_month">
                  arrow_back_ios
                </span>
              </button>
              <div id="month"></div>
              <button id="GO" type="button" class="button_month">
                <span class="material-symbols-outlined arrow_month">
                  arrow_forward_ios
                </span>
              </button>
            </span>
            <div id="group_total_resume">
              <div id="group_resume">
                <span id="group_total" class="containerResume">
                  <div class="titleContainerResume">
                    <span class="material-symbols-outlined" id="walletIcon">
                      wallet </span
                    >Saldo Anual<br />
                  </div>
                  <strong id="total_year"></strong>
                </span>
                <span class="containerResume">
                  <div class="titleContainerResume">
                    <span class="material-symbols-outlined" id="articlePerson">
                      article_person </span
                    >Resumo Mensal <br />
                  </div>
                  <strong id="calc_resume_month"></strong
                ></span>
                <span id="revenue " class="containerResume">
                  <div class="titleContainerResume">
                    <span
                      class="material-symbols-outlined"
                      id="arrowCircleUpIcon"
                    >
                      arrow_circle_up </span
                    >Recebidos Mesal<br />
                  </div>
                  <strong id="month_revenue"></strong
                ></span>

                <span class="containerResume">
                  <div class="titleContainerResume">
                    <span
                      class="material-symbols-outlined"
                      id="checkCircleIcon"
                    >
                      check_circle
                    </span>
                    Despesas pagas<br />
                  </div>
                  <strong id="amount_paid"></strong>
                </span>

                <span class="containerResume">
                  <div class="titleContainerResume">
                    <span
                      class="material-symbols-outlined"
                      id="arrowCircleDownIcon"
                    >
                      arrow_circle_down </span
                    >Despesas ativas <br />
                  </div>
                  <strong id="amount_pending"></strong
                ></span>
              </div>
            </div>
          </div>

          <div id="button_option">
            <div class="open" id="options">
              <ul>
                <li id="btn_revenue">
                  <span class="material-symbols-outlined"> add </span> Receita
                </li>
                <li id="btn_expense">
                  <span class="material-symbols-outlined"> add </span> Despesa
                </li>
                <li id="btn_category">
                  <span class="material-symbols-outlined">
                    tv_options_edit_channels
                  </span>
                  Categorias
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <main id="other_body">
        <div id="search_filters">
          <div class="search_item">
            <label for="search_input">Buscar</label>
            <input
              type="search"
              class="input_search"
              id="search_input"
              placeholder="Buscar por descrição..."
            />
          </div>
          <div class="search_item">
            <label for="search_description">Tipo</label>
            <select class="input_search" type="" id="search_description">
              <option value="all" selected>Todos os tipos...</option>
              <option value="expense">Despesa</option>
              <option value="revenue">Receita</option>
            </select>
          </div>
          <div class="search_item">
            <label for="search_category">Categoria</label>
            <select type="" class="input_search" id="search_category">
              <option value="all" selected="">Todas as categorias...</option>
            </select>
          </div>
          <!--Calendário do input inicial-->

          <div class="search_item">
            <label for="daterange">Período</label>
            <input
              type="text"
              id="daterange"
              placeholder="Selecione o período"
            />
          </div>
        </div>
        <div id="main_content_body">
          <div id="resultResume"></div>

          <div id="group_cards"></div>
          <div id="pagination">
            <ul>
              <li><</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>></li>
            </ul>
          </div>
        </div>
      </main>

      <div id="modalContainer">
        <!-- INSERIDO PELO JS-->
      </div>
    </div>
    <footer>
      <!-- Informações do rodapé -->
      <p>&copy; 2025 Minha Empresa. Todos os direitos reservados.</p>
      <p><a href="/contact">Contacte-nos</a></p>
    </footer>
    <div id="loading-overlay" class="hidden">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>
    <div id="body_modal" class="hidden">
      <div id="confirm_modal" class="modal danger">
        <div id="modal_box">
          <span id="icon_modal" class="material-symbols-outlined"
            >delete_forever</span
          >
          <p id="confirm_title">Atenção</p>
          <p id="confirm_message"></p>

          <div class="actions">
            <button id="confirm_no">Não, manter</button>
            <button id="confirm_yes">Sim, Deletar.</button>
          </div>
        </div>
      </div>
    </div>
    <div id="toast-container"></div>`;
  initHome();
}

/*=================
===================
      INIT
===================
=================== */

export function initHome() {
  new Litepicker({
    element: document.getElementById("daterange"),
    singleMode: false,
  });

  setupCalendar();
  setupModalGlobalListeners();

  setupHomeButtons();
  showLoading();

  const current = getCurrentMonthYear();
  if (current) {
    LoadExpenses(current.monthIndex, current.yearIndex);
  }
  hideLoading();
  initSearchArea();
}
/*=================
===================
      BOTÕES FIXOS
===================
=================== */

function setupHomeButtons() {
  const btnExpense = document.getElementById("btn_expense");
  const btnRevenue = document.getElementById("btn_revenue");
  const btnCategory = document.getElementById("btn_category");
  if (btnExpense) {
    btnExpense.addEventListener("click", async () => {
      await renderFormTransaction();
      overflowHidden();
      const modal = document.querySelector("#new_modal_js");
      modal.dataset.formType = "expense";

      initTransactionForm?.("expense");
      loadCategoryFormExpense?.();
      loadPaymentMethodsExpense?.();
      initExpensesForm?.();
      setAtualMonth();
      setupTitleTransactionForm("expense");

      const amount = document.getElementById("amount");
      amount?.addEventListener("input", setFormatMoney);
    });
  }

  if (btnCategory) {
    btnCategory.addEventListener("click", async () => {
      //ABRIR MODAL COM CATEGORIAS
      await openListCategory();
    });
  }

  if (btnRevenue) {
    btnRevenue.addEventListener("click", async () => {
      await renderFormTransaction();
      overflowHidden();
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
}

/* ==============================
   EVENTOS GLOBAIS
================================ */

document.addEventListener("click", async (e) => {
  const current = getCurrentMonthYear();
  if (!current) return;

  const { monthIndex, yearIndex } = current;
  /* EDITAR */
  const buttonEdit = e.target.closest(".edit_transaction");
  if (buttonEdit) {
    const id = buttonEdit.dataset.id; // pegar direto do botão
    console.log("O botão clicado foi da transação", id);

    const categoryModal = await fetch(`/api/transactions/${id}/category`);
    const category = await categoryModal.json();

    showLoading();
    await renderFormTransaction();

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
        const type = "expense";
        sendTransactionsEditions(type);
      } else if (category.data.toString() === "revenue") {
        await loadCategoryFormRevenue();
        await setupTitleTransactionForm("edit_revenue");
        await loadPaymentMethodsRevenue?.();
        const type = "revenue";
        sendTransactionsEditions(type);
      }

      await initExpensesForm();
      LoadDataAndEditTransaction(transaction);
    } catch (err) {
      console.error("Erro ao buscar transação", err);
    } finally {
      hideLoading();
    }
  }
  /* REMOVER */
  const buttonRemove = e.target.closest(".button_remove");
  if (buttonRemove) {
    const ConfirmStatus = await showConfirm({
      message: "Você realmente quer excluir essa transação?",
      theme: "danger",
    });

    if (!ConfirmStatus) {
      return;
    }

    const id = buttonRemove.dataset.id;

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
  /* STATUS */
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
  }

  /* VOLTAR MODAL */

  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  closeModal();
  await openListCategory();
});

/* ==============================
   SEARCH
================================ */
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

/* ==============================
   UTILS
================================ */

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

export async function SetStatusInTransactions(id) {
  const current = getCurrentMonthYear();
  if (!current) return;

  const { monthIndex, yearIndex } = current;
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
    showToast("Operação concluída com Sucesso", 3000);

    hideLoading();
  }
}
