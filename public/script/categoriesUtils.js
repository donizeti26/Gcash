import { openModal } from "./modalUtils.js";

export function sendCategoryNewCategory() {
  const formNewCategory = document.getElementById("form_new_category");

  if (formNewCategory) {
    formNewCategory.addEventListener("submit", async (e) => {
      e.preventDefault(); /*impede o envio padrão do formulário */

      const name_category = document.getElementById("name_category").value;
      const color_selector = document.getElementById("color_selector").value;
      const icon_selected = document.getElementById("selected_icon").value;
      const option_new_category = document.getElementById(
        "option_new_category"
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
        console.log("Resposta do servidor:", data); // <-- aqui você vê o que voltou
        window.alert("Categoria " + data.name + " cadastrada com sucesso!");
      } catch (err) {
        console.error("Erro no cadastro:", err);
        window.alert("Erro no cadastrado");
      }
    });
  }
}

export async function loadCategories() {
  try {
    const response = await fetch("/api/categories");
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
              <span class="material-symbols-rounded">
                 ${cat.icon}
              </span> ${cat.name}
            </div>
          <div class="edit_category">

            <span class="edit_document  material-symbols-rounded"  data-id="${cat.category_id}">
              edit_document 
            </span>
            <span class="delete_forever  material-symbols-rounded"  data-id="${cat.category_id}">
              delete_forever 
            </span>
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
    "#option_new_category"
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
    const selectedCategory = await fetch(`/api/categories/categories/${id}`);
    const category = await selectedCategory.json();

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
