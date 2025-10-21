export function initCategoryForm() {
  const formNewCategorie = document.getElementById("form_new_categorie");

  if (formNewCategorie) {
    formNewCategorie.addEventListener("submit", async (e) => {
      e.preventDefault(); /*inpede o envio padrão do formulário */

      const name_categorie = document.getElementById("name_categorie").value;
      const color_selector = document.getElementById("color_selector").value;
      const icon_selected = document.getElementById("selected_icon").value;
      const option_new_category = document.getElementById(
        "option_new_category"
      );
      const category_selected = option_new_category.value;

      try {
        const response = await fetch("/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_categorie,
            color_selector,
            icon_selected,
            category_selected,
          }),
        });
        const data = await response.json();
        console.log("📦 Resposta do servidor:", data); // <-- aqui você vê o que voltou
        window.alert("Categoria " + data.name + " cadastrada com sucesso!");
      } catch (err) {
        console.error("❌ Erro no cadastro:", err);
        window.alert("Erro no cadatrado");
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
      item.classList.add("categorie_item");

      item.innerHTML = `
          <div class="group_category">
            <div class="icon_item_category" id="item_category_${cat.category_id}">
              <span class="material-symbols-outlined">
                 ${cat.icon}
              </span> ${cat.name}
            </div>
          <div class="edit_categorie">

            <span class="edit_document  material-symbols-outlined">
              edit_document 
            </span>
                          <p> Editar</p>
            </div>
          </div>`;

      if (list) {
        list.appendChild(item);
      }

      const item_category = item.querySelector(
        `#item_category_${cat.category_id}`
      );
    });
  } catch (err) {
    console.error("Erro ao carregar categorias ", err);
  }
}
