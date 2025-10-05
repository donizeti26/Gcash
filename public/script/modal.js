import { stopmenuindex } from "./ui.js";
export async function openModal(arquivo) {
  const res = await fetch(arquivo);

  if (!res.ok) throw new Error(`Falha ao carregar ${arquivo}: ${res.status}`);
  const html = await res.text();
  const modalContainer = document.getElementById("modalContainer");

  if (!modalContainer) throw new Error("#modaContainer não encontrado na DOM");
  modalContainer.innerHTML = html;

  const button_categorie = document.getElementById("button_categorie");
  const button_close_card = document.querySelector(".button_close_card");
  const cancelar_create_card = document.getElementById("cancelar_create_card");

  if (button_categorie) {
    button_categorie.addEventListener("click", () => {
      openModal("new_categorie.html");
    });
  }
  if (button_close_card) {
    button_close_card.addEventListener("click", () => {
      fecharModal();
    });
  }

  if (cancelar_create_card) {
    cancelar_create_card.addEventListener("click", () => {
      fecharModal();
    });
  }
  setupModalGlobalListeners();
  return modalContainer;
}

export function fecharModal() {
  stopmenuindex();
  document.getElementById("modalContainer").innerHTML = "";
}
export function setupModalGlobalListeners() {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  // ESC
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharModal();
    }
  });

  //fechar ao clicar fora
  document.addEventListener("click", function (e) {
    const new_modal_js = document.getElementById("new_modal_js");
    const resume_month = document.getElementById("resume_month");
    const other_body = document.getElementById("other_body");
    if (
      e.target === new_modal_js ||
      resume_month.contains(e.target) ||
      other_body.contains(e.target)
    ) {
      fecharModal();
      console.log("FUNCIONANDO");
    }
  });
}
