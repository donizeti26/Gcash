import { fecharModal, openModal } from "./modal.js";

export function initCategoryForm() {
  const formNewCategorie = document.getElementById("form_new_categorie");

  if (formNewCategorie) {
    formNewCategorie.addEventListener("submit", async (e) => {
      e.preventDefault(); /*inpede o envio padrão do formulário */

      const name_c = document.getElementById("name_categorie").value;
      const color_selector = document.getElementById("color_selector").value;
      const icon_selected = document.getElementById("selected_icon").value;

      try {
        const response = await fetch("/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name_c, color_selector, icon_selected }),
        });
        const data = await response.json();
        console.log("📦 Resposta do servidor:", data); // <-- aqui você vê o que voltou
        window.alert("Categoria " + data.name_c + " cadastrada com sucesso!");
      } catch (err) {
        console.error("❌ Erro no cadastro:", err);
        window.alert("Erro no cadatrado");
      }
    });
  }
}

export async function loadCategories() {
  try {
    const response = await fetch("/categories");
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
            <div class="item_category">
              <span class="material-symbols-outlined">
                 ${cat.icon}
              </span> ${cat.name}
            </div>
            <span class="menu  material-symbols-outlined">
              menu
            </span>
          </div>`;

      if (list) {
        list.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar categorias ", err);
  }
}
