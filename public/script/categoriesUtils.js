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
        const response = await fetch("/api/categories/categories", {
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
    const response = await fetch("/api/categories/categories");
    const categories = await response.json();

    const list = document.getElementById("list_categories");
    if (list) {
      list.innerHTML = "";
    }

    categories.forEach((cat) => {
      const item = document.createElement("li");
      item.classList.add("category_item");

      item.innerHTML = `
          <div class="group_category">
            <div class="icon_item_category" id="item_category_${cat.category_id}">
              <span class="material-symbols-rounded">
                 ${cat.icon}
              </span> ${cat.name}
            </div>
          <div class="edit_category">

            <span class="edit_document  material-symbols-rounded">
              edit_document 
            </span>
                          <p> Editar</p>
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

export async function loadCategoryFormExpense() {
  try {
    const response = await fetch("/api/categories/categoriesExpense");
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
    const response = await fetch("/api/categories/categoriesRevenue");
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
