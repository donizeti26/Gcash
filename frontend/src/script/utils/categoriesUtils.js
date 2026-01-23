import { closeModal, overflowHidden, showToast } from "./modalUtils.js";
import { showLoading, hideLoading } from "./loadingUtils.js";
import { renderFormCategory } from "../../views/form_category.js";

import { LoadExpenses } from "./sharedUtils.js";
import { countTransaction } from "./transactionsUtils.js";
import { testDisplay } from "./iconsUtils.js";
import {
  sumAtualMonthPaid,
  resumeMonthInsert,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
  sumAmountYear,
} from "./formTransactionsUtils.js";

import { renderDeleteCategoryOption } from "../../views/delete_category_options.js";
import { renderListCategories } from "../../views/list_categories.js";
import { getCurrentMonthYear, showConfirm } from "../index.logic.js";

export async function openListCategory() {
  showLoading();
  renderListCategories();

  await loadCategories?.();
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const dataAtual = new Date();
  const mesNum = dataAtual.getMonth() + 1;

  console.log("MES QUE ESTOU PEGANDO" + mesNum);

  const totalTransactions = await countTransaction(mesNum);

  const tagTotalTransactions = document.getElementById("num_transactions");
  const listCategories = document.querySelector("#list_categories");

  tagTotalTransactions.textContent = ` ${totalTransactions}`;

  listCategories.addEventListener("click", async (e) => {
    const editButton = e.target.closest(".edit_document");
    const deleteButton = e.target.closest(".delete_forever");
    const { monthIndex, yearIndex } = getCurrentMonthYear();
    if (editButton) {
      showLoading();

      console.log(editButton);
      const id = editButton.dataset.id;
      console.log(id);
      if (editButton) {
        await renderFormCategory();
      }

      try {
        const category = await fetchCategory(id);
        await fillCategoryForm(category);
      } catch (err) {
        console.error("Erro ao buscar a categoria", err);
      }
      hideLoading();
    }
    if (deleteButton) {
      const id = deleteButton.dataset.id;

      const response = await fetch(`/api/transactions/reports/count?id=${id}`);
      const data = await response.json();
      const totalTransactions = Number(data.total);

      let ConfirmStatus;
      if (totalTransactions > 0) {
        ConfirmStatus = await DeleteOptions(id, totalTransactions);
      } else {
        ConfirmStatus = await showConfirm({
          message: "Você quer realmente apagar essa transação?",
          theme: "danger",
        });
      }

      if (!ConfirmStatus) {
        return;
      }

      try {
        showLoading();

        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();
        console.log(data.message);

        await loadCategories();
        await sumAmountYear(monthIndex, yearIndex);
        await sumAtualMonthPaid(monthIndex, yearIndex);
        await resumeMonthInsert(monthIndex, yearIndex, "sum");
        await sumAmountMonthRevenue(monthIndex, yearIndex);
        await sumAtualMonthPending(monthIndex, yearIndex);
        await LoadExpenses(monthIndex, yearIndex);
        showToast("Operação concluída com Sucesso", 3000);
      } catch (err) {
        console.error("Erro ao buscar a categoria", err);
      }
    }
  });

  const btnNewCategory = document.getElementById("button_category");
  if (btnNewCategory && !btnNewCategory.dataset.listenerAdded) {
    btnNewCategory.addEventListener("click", async () => {
      await abrirNovaCategoria();
    });

    btnNewCategory.dataset.listenerAdded = "true";
  }

  hideLoading();
}

export async function abrirNovaCategoria() {
  await renderFormCategory();
  const buttonIcons = document.getElementById("button_icons");
  buttonIcons.addEventListener("click", async (e) => {
    testDisplay();
  });

  sendCategoryNewCategory?.();
}

export async function DeleteOptions(id, totalTransactions) {
  await renderDeleteCategoryOption();
  overflowHidden(true);

  const containerTitle = document.getElementById("containerOptionsDelete");
  const title = containerTitle.querySelector("#contTransactions");
  title.textContent = totalTransactions;
  console.log(title);

  return new Promise((resolve) => {
    const modal = document.getElementById("containerOptionsDelete");
    const form = modal.querySelector("#formOptionsDelete");

    const modalContainerListCategories = document.getElementById(
      "modalContainerListCategories",
    );

    modal.querySelector("#buttonCancel").onclick = () => {
      resolve(false);
      modalContainerListCategories.innerHTML = "";
      overflowHidden(false);
    };
    form.addEventListener("submit", (e) => {
      // Primeiro: validação nativa
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      resolve(true);

      e.preventDefault();
      closeModal();
    });
  });
}

export function sendCategoryNewCategory() {
  const formNewCategory = document.getElementById("form_new_category");

  if (formNewCategory) {
    formNewCategory.addEventListener("submit", async (e) => {
      e.preventDefault(); /*impede o envio padrão do formulário */

      const name_category = document.getElementById("name_category").value;
      const color_selector = document.getElementById("color_selector").value;
      const icon_selected = document.getElementById("selected_icon").value;
      const option_new_category = document.getElementById(
        "option_new_category",
      );
      const category_selected = option_new_category.value;

      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_category,
            color_selector,
            icon_selected,
            category_selected,
          }),
        });
        const data = await response.json();
        console.log("Resposta do servidor:", data);
        showToast("Categoria " + data.name + " cadastrada com sucesso!", 3000);
        closeModal();
        openListCategory();
      } catch (err) {
        console.error("Erro no cadastro:", err);
        window.alert("Erro no cadastrado");
      }
    });
  }
}

export async function loadCategories() {
  try {
    const response = await fetch("/api/categories?type=all");
    const categories = await response.json();

    const list = document.getElementById("list_categories");
    if (list) {
      list.innerHTML = "";
    }

    categories.forEach((cat) => {
      const item = document.createElement("li");
      item.classList.add("category_item");

      item.innerHTML = `
          <div class="group_category" ">
            <div class="icon_item_category" id="item_category_${cat.category_id}">
            <div class="border_icon_list_category">
              <span class="material-symbols-outlined">
                 ${cat.icon}
              </span>
              </div>
              <div>
              <strong> ${cat.name}</strong>
              <p class = "description_category">A descrição da Categoria aqui</p>
              </div>
            </div>
          <div class="edit_category">
            <div class="border_uis_list_category">
            <span class="edit_document  material-symbols-outlined"  data-id="${cat.category_id}">
              edit_document 
            </span>
            </div>
            <div class="border_uis_list_category">
            <span class="delete_forever  material-symbols-outlined"  data-id="${cat.category_id}">
              delete_forever 
            </span>
            </div>
            </div>
          </div>`;

      if (list) {
        list.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar categorias ", err);
  }
}
export async function fillCategoryForm(category) {
  const formNewCategory = document.getElementById("form_new_category");
  const titleModal = formNewCategory.querySelector("#title_modal");
  const nameCategory = formNewCategory.querySelector("#name_category");
  const optionNewCategory = formNewCategory.querySelector(
    "#option_new_category",
  );
  const colorSelector = formNewCategory.querySelector("#color_selector");
  const selectedIcon = formNewCategory.querySelector("#selected_icon");
  const buttonIcon = formNewCategory.querySelector("#add_reaction");

  titleModal.textContent = "Editando categoria";
  nameCategory.value = category.name;
  optionNewCategory.value = category.type;
  colorSelector.value = category.color;
  selectedIcon.value = category.icon;
  buttonIcon.textContent = category.icon;
}

export async function fetchCategory(id) {
  try {
    const selectedCategory = await fetch(`/api/categories/category/${id}`);
    const category = await selectedCategory.json();
    sendCategoryEditions();
    return category;
  } catch (err) {
    console.log("Erro ao buscar a categoria", err);
  }
}
export async function loadCategoryFormExpense() {
  try {
    const response = await fetch("/api/categories?type=expense");
    const categories = await response.json();

    const select = document.getElementById("category_id");

    if (select) {
      select.innerHTML = `<option value="" disabled selected>Selecionar</option>`;
    }

    categories.forEach((cat) => {
      const item = document.createElement("option");
      item.value = cat.category_id;
      item.textContent = cat.name;

      if (select) {
        select.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar categorias", err);
  }
}

export async function loadCategoryFormRevenue() {
  try {
    const response = await fetch("/api/categories?type=revenue");
    const categories = await response.json();

    const select = document.getElementById("category_id");

    if (select) {
      select.innerHTML = `<option value="" disabled selected>Selecionar</option>`;
    }

    categories.forEach((cat) => {
      const item = document.createElement("option");
      item.value = cat.category_id;
      item.textContent = cat.name;

      if (select) {
        select.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar categorias", err);
  }
}

export async function openCategoryEditor(categoryId) {
  try {
    await openModal("../views/list_categories.html");
  } catch (err) {
    console.error("Erro ao abrir modal de editar categorias", err);
  }
}

export async function sendCategoryEditions() {
  const formCategory = document.getElementById("form_new_category");

  if (!formCategory) return;
  formCategory.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameCategory = document.getElementById("name_category").value;

    const optionNewCategory = document.getElementById(
      "option_new_category",
    ).value;
    const colorSelector = document.getElementById("color_selector").value;
    const selectedIcon = document.getElementById("selected_icon").value;

    try {
      await fetch(`/api/categories/${category_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameCategory,
          optionNewCategory,
          colorSelector,
          selectedIcon,
        }),
      });
    } catch (err) {
      alert("Erro ao atualizar Categoria");
    } finally {
      showToast("Operação concluída com Sucesso", 3000);

      closeModal(); // ← ISSO AGORA VAI RODAR!
      await loadCategories();
    }
  });
}
