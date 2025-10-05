import { openModal, fecharModal, setupModalGlobalListeners } from "./modal.js";
import { setupUI } from "./ui.js";
import { setupCalendar } from "./calendar.js";

// INICIALIÇÕES GLOBAIS
setupUI();
setupCalendar();
setupModalGlobalListeners();

/////////////////////////////////////////////////////
////////////CADASTRAR DESPESAS//////////////
////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  // BOTAO PARA ABRIR DESPESAS (E INICIALIZAR INSTALLMENTS)
  const btnDespesas = document.getElementById("despesas");
  if (btnDespesas) {
    btnDespesas.addEventListener("click", async () => {
      //ABRIR MODAL COM HTML DE DESPESAS
      //DEPOIS QUE O HTML É INJETADO, INICIALIZA A LÓGICA DAS PARCELAS
      await openModal("form_expenses.html");
      const installmentsMod = await import("./installments.js").catch(
        () => ({})
      );
      installmentsMod.initTransactionForm?.();
      installmentsMod.loadCategoryForm?.();
      installmentsMod.loadPaymentMethods?.();
      installmentsMod.initExpensesForm?.();
      installmentsMod.initCategoryForm?.();
      setupCalendar?.();

      const amount = document.getElementById("amount");

      amount.addEventListener("input", (event) => {
        let valor = event.target.value;
        valor = valor.replace(/\D/g, "");

        valor = valor.replace(/(\d)(\d{2})$/, "$1,$2");

        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        event.target.value = "R$" + valor;
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

async function abrirCategorias() {
  await openModal("form_categories.html");

  const categoriesMod = await import("./categories.js").catch(() => ({}));
  categoriesMod.loadCategories?.();

  const iconsMod = await import("./icons.js").catch(() => ({}));
  iconsMod.criate_icons?.();

  const btnNewCategorie = document.getElementById("button_categorie");

  if (btnNewCategorie && !btnNewCategorie.dataset.listenerAdded) {
    btnNewCategorie.addEventListener("click", async () => {
      await abrirNovaCategoria(categoriesMod);
    });

    btnNewCategorie.dataset.listenerAdded = "true";
  }
}

async function abrirNovaCategoria(categoriesMod) {
  await openModal("new_categorie.html");
  categoriesMod.initCategoryForm?.();
}

document.addEventListener("click", async (e) => {
  const backBtn = e.target.closest(".button_back_card");
  if (!backBtn) return;
  fecharModal();
  await abrirCategorias();
});

//BOTAO RECEITAS
const btnReceita = document.getElementById("receita");
if (btnReceita) {
  btnReceita.addEventListener("click", async () => {
    await openModal("form_revenue.html");
    setupCalendar();

    const revenueMod = await import("./installments.js").catch(() => ({}));
    revenueMod.initExpensesForm?.();
  });
}

////////////////////////////////////////////////////////////////////////////
/////////////////////Carregar despesas na tela inicial.//////////////////
//////////////////////////////////////////////////////////////////////////

async function LoadExpenses() {
  try {
    const response = await fetch("/transactionsGet");
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
          <p><strong>Status: </strong>${cat.status}</p>
          <p> <strong>Descrição: </strong>${cat.description}
          </p>
        </div>
      </div>
      <div class="button_black_card">
      

        <button class="button_black">Editar Transação</button>
      </div>

`;

      const iconSpan = item.querySelector(`#icon_${cat.transaction_id}`);
      const circle = item.querySelector(`#circle_${cat.transaction_id}`);

      if (iconSpan) {
        ("");
        iconSpan.style.backgroundColor = cat.color;
      }
      if (circle && cat.status === "paid") {
        circle.classList.add("circle_paid");
        console.log("Classe adicionada em:", circle.className);
      } else if (circle && cat.status === "peding") {
        circle.classList.add("circle_peding");
        console.log("Classe adicionada em:", circle.className);
      }
      if (group_cards) {
        group_cards.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar Transações no Index", err);
  }
}
LoadExpenses();
