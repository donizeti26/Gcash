import {
  closeSubModal,
  closeModal,
  overflowHidden,
  showToast,
} from "./modalUtils.js";
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
import {
  getCurrentMonthYear,
  showConfirm,
  loadComponentsHome,
  searchLoadCategories,
} from "../index.logic.js";

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
      const type = data.type;
      console.table(data);
      let decision;
      if (totalTransactions > 0) {
        decision = await DeleteOptions(id, totalTransactions, type);
      } else {
        const confirmed = await showConfirm({
          message: "Você quer realmente apagar essa transação?",
          theme: "danger",
        });
        decision = confirmed ? { action: "deleteAll" } : { action: "cancel" };
      }

      if (decision.action === "cancel") {
        return;
      }
      if (decision.action === "changeCategory") {
        await updateCategoryOfTransactions(decision.newCategoryId);
        await deleteCategoryAllTransactions(id);
        console.log("★★★ deletou e alterou");
        document.getElementById("modalContainerListCategories").innerHTML = "";
        overflowHidden(false);
        return;
      }
      if (decision.action === "deleteAll") {
        await deleteCategoryAllTransactions(id);
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

async function updateCategoryOfTransactions(category) {
  const response = fetch("/api/transactions/bulk?action=change-category", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("Erro ao atualizar transação");
  }

  return response.json();
}

async function deleteCategoryAllTransactions(id) {
  try {
    showLoading();

    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data.message);
    const { monthIndex, yearIndex } = getCurrentMonthYear();
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

export async function abrirNovaCategoria() {
  await renderFormCategory();
  const buttonIcons = document.getElementById("button_icons");
  buttonIcons.addEventListener("click", async (e) => {
    testDisplay();
  });

  sendCategoryNewCategory?.();
}

export async function DeleteOptions(id, totalTransactions, type) {
  await renderDeleteCategoryOption(type);
  const categoryToBeExcluded = Number(id);
  const listCategoriesForm = await searchLoadCategories(type);
  const containerTitle = document.getElementById("containerOptionsDelete");
  const title = containerTitle.querySelector("#contTransactions");

  overflowHidden(true);

  title.textContent = totalTransactions;
  console.log(title);

  return new Promise((resolve) => {
    const modal = document.getElementById("containerOptionsDelete");
    const form = modal.querySelector("#formOptionsDelete");
    const buttonSubmit = form.querySelector("#buttonSetSubmit");
    const changeCategory = document.getElementById("changeCategory");
    const deleteAll = document.getElementById("deleteAll");
    const otherCategories = document.getElementById("otherCategories");
    const modalContainerListCategories = document.getElementById(
      "modalContainerListCategories",
    );

    modal.querySelector("#buttonCancel").onclick = () => {
      resolve({ action: "cancel" });
      modalContainerListCategories.innerHTML = "";
      overflowHidden(false);
    };

    form.addEventListener("click", () => {
      changeCategory.addEventListener("change", handleChange);
      deleteAll.addEventListener("change", handleChange);
    });
    console.log("★★★S★★" + id);
    function handleChange() {
      otherCategories.innerHTML = "";

      if (changeCategory.checked) {
        otherCategories.disabled = false;
        listCategoriesForm
          .filter((cat) => cat.category_id !== categoryToBeExcluded)
          .forEach((cat) => {
            const item = document.createElement("option");
            item.innerHTML = `${cat.name}`;
            item.value = `${cat.category_id}`;
            if (otherCategories) {
              otherCategories.appendChild(item);
            }
          });

        buttonSubmit.textContent = "Alterar";
        buttonSubmit.style.backgroundColor = "var(--button-color-purple)";
      }
      if (deleteAll.checked) {
        otherCategories.disabled = true;
        otherCategories.innerHTML = `<option value="" selected="">Selecionar</option>`;

        buttonSubmit.textContent = "Deletar";
        buttonSubmit.style.backgroundColor = "var(--button-color-red)";
      }
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Primeiro: validação nativa
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        console.log("★ checkValidity");
        return;
      }

      if (deleteAll.checked) {
        resolve({ action: "deleteAll" });
        e.preventDefault();
        closeModal();
      }

      if (changeCategory.checked) {
        console.log("otherCategories");
        var newCategoryId = document.getElementById("otherCategories").value;
        console.log("★★★★★" + newCategoryId);
        resolve({ action: "changeCategory", newCategoryId });
      }
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
    sendCategoryEditions(id);
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

export async function sendCategoryEditions(category_id) {
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
    console.log("★ sendCategoryEditions");

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
      const current = getCurrentMonthYear();
      if (!current) return;
      const { monthIndex, yearIndex } = current;
      await loadComponentsHome(monthIndex, yearIndex);
      await loadCategories();
      closeSubModal();
    }
  });
}
