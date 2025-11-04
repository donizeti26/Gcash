import { openModal, fecharModal, setupModalGlobalListeners } from "./modal.js";
/*import { setupUI } from "./ui.js";*/
import { setupCalendar, setAtualMonth } from "./calendar.js";
import { carregarDadosEditarTransacao } from "./edit_transactions.js";
import {
  loadCategoryForm,
  loadPaymentMethods,
  initExpensesForm,
  sumAtualMonthPaid,
  sumAtualMonthPeding,
  sumAmountMonthRevenue,
  sumAmountMonth,
} from "./installments.js";
import { showLoading, hideLoading } from "./utils.js";

// INICIALIÇÕES GLOBAIS
/*
setupUI();
*/
setupCalendar();
setupModalGlobalListeners();

/////////////////////////////////////////////////////
////////////INICIAR FORM TRANSAÇÕES//////////////
////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  // BOTAO PARA ABRIR DESPESAS (E INICIALIZAR INSTALLMENTS)
  showLoading();
  const btnDespesas = document.getElementById("despesas");
  if (btnDespesas) {
    btnDespesas.addEventListener("click", async () => {
      //ABRIR MODAL COM HTML DE DESPESAS
      //DEPOIS QUE O HTML É INJETADO, INICIALIZA A LÓGICA DAS PARCELAS
      await openModal("../views/form_expenses.html");
      const installmentsMod = await import("./installments.js").catch(
        () => ({})
      );
      installmentsMod.initTransactionForm?.();
      installmentsMod.loadCategoryForm?.();
      installmentsMod.loadPaymentMethods?.();
      installmentsMod.initExpensesForm?.();
      installmentsMod.initCategoryForm?.();
      setAtualMonth();
      const amount = document.getElementById("amount");

      amount.addEventListener("input", (event) => {
        setFormatMoney(event);
      });
    });
  }
});

//BOTAO CATEGORIA (ABRE O FORM_CATEGORIASHTML E INICIALIZA CATEGORIAS + ICONS DE NEW CATEGORIA)
const btnCategoria = document.getElementById("categoria");

if (btnCategoria) {
  btnCategoria.addEventListener("click", async () => {
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

/////////////////////////////////////////////////////
////////////INICIAR FORM CATEGORIAS//////////////
////////////////////////////////////////////////////
async function abrirCategorias() {
  showLoading();
  await openModal("../views/form_categories.html");

  const categoriesMod = await import("./form_expenses.js").catch(() => ({}));
  categoriesMod.loadCategories?.();

  const iconsMod = await import("./icons.js").catch(() => ({}));
  iconsMod.criate_icons?.();

  const btnNewCategorie = document.getElementById("button_categorie");

  if (btnNewCategorie && !btnNewCategorie.dataset.listenerAdded) {
    btnNewCategorie.addEventListener("click", async () => {
      await abrirNovaCategoria(categoriesMod);
    });

    btnNewCategorie.dataset.listenerAdded = "true";
    hideLoading();
  }
}

async function abrirNovaCategoria(categoriesMod) {
  await openModal("../views/new_categorie.html");
  categoriesMod.sendCategoryNewCategory?.();
}

document.addEventListener("click", async (e) => {
  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  fecharModal();
  await abrirCategorias();
});

/////////////////////////////////////////////////////////
////////////INICIAR FORM REVENUE//////////////
////////////////////////////////////////////////////////
const btnReceita = document.getElementById("receita");
if (btnReceita) {
  btnReceita.addEventListener("click", async () => {
    await openModal("../views/form_revenue.html");

    const revenueForm = await import("./form_revenue.js").catch(() => ({}));
    const revenueMod = await import("./installments.js").catch(() => ({}));
    revenueMod.initTransactionForm?.();
    revenueMod.initExpensesForm?.();
    revenueForm.loadCategoryFormRevenue?.();
    revenueMod.loadPaymentMethods?.();
    setAtualMonth();
    amount.addEventListener("input", (event) => {
      setFormatMoney(event);
    });
  });
}

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
      let statusTrasaction;
      if (cat.status == "paid") {
        statusTrasaction = "Pago";
      } else if (cat.status == "pending") {
        statusTrasaction = "Pendente";
      } else {
        statusTrasaction = "Receita";
      }

      item.innerHTML = `
      <div class="title_date">
        <strong class="title_categorie">${cat.name}</strong>
        <p>${cat.due_date}</p>
      </div>
      <div class="div_icon_categorie">
        <span
          class="material-symbols-outlined icon_categorie"
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
          <p><strong>Status: </strong>${statusTrasaction}</p>
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
        if (cat.type === "expense") {
          console.log("FUCIONANDO MEU PATRÃO MESMO");
          const buttonPay = document.createElement("button");
          buttonPay.id = `transaction_${cat.transaction_id}`;
          buttonPay.dataset.id = cat.transaction_id;
          console.log("ID da transação:", id);
          const res = await fetch(
            `/api/transactions/transactions/${id}/status`
          );
          const statusData = await res.json();
          if (statusData == "paid") {
            buttonPay.classList.add(
              "button_set_status",
              "button_set_status_peding"
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
        } else {
          console.log("FUCIONANDO MEU PATRÃO");
        }
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
        circle.classList.add("circle_peding");
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

/////////////////////////////////////////
/////////EDITAR TRANSACOES///////////////////
/////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".edit_transaction");
  if (!button) return;

  const id = button.dataset.id; // pegar direto do botão
  console.log("O botão clicado foi da transação", id);
  showLoading();
  await openModal("../views/edit_transactions.html");

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
    await loadPaymentMethods();
    await initExpensesForm();
    carregarDadosEditarTransacao(transaction);
  } catch (err) {
    console.error("Erro ao buscar transacao", err);
  } finally {
    hideLoading();
  }
});

////////////////////////////////////////////////////////////////////
/////////ALTERAR STATUS TRANSACOES//////////////////////
/////////////////////////////////////////////////////////////////

document.addEventListener("click", async (e) => {
  const button = e.target.closest(".button_set_status");

  if (!button) return;

  const id = button.dataset.id;

  console.log("Mudando status da transação " + id);

  await SetStatusInTransations(id);
  await sumAmountMonth(monthIndex, year_index);
  await sumAtualMonthPaid(monthIndex, year_index);
  await sumAmountMonthRevenue(monthIndex, year_index);
  await sumAtualMonthPeding(monthIndex, year_index);
  await LoadExpenses(monthIndex, year_index);
});

///////////////////////////////////////////////////////////
////////pedindo para o back mudar o status/////////
//////////////////////////////////////////////////////////
export async function SetStatusInTransations(id) {
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
    const status = await response.json(); // status agora é diretamente a string "paid" ou "peding"

    console.log("Status da transação", id, "é", status);
    return status;
  } catch (err) {
    console.error("Error ao consulktar status: ", err.message);
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
    await SetStatusInTransations(id);
    await sumAmountMonth(monthIndex, year_index);
    await sumAtualMonthPaid(monthIndex, year_index);
    await sumAmountMonthRevenue(monthIndex, year_index);
    await sumAtualMonthPeding(monthIndex, year_index);
    await LoadExpenses(monthIndex, year_index);
  } catch (err) {
    console.error("Erro ao apagar: ", err);
  }
});
