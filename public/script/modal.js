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
  const modalContainer = document.getElementById("modalContainer");
  document.getElementById("modalContainer").innerHTML = "";
}
export function setupModalGlobalListeners() {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  window.onclick = function (e) {
    if (e.target === modalContainer) {
      fecharModal();
    }
  };

  // ESC
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharModal();
    }
  });

  //fechar ao clicar fora
  modalContainer.addEventListener("click", function (e) {
    const new_modal_js = document.getElementById("new_modal_js");
    if (e.target === new_modal_js) {
      fecharModal();
      console.log("FUNCIONANDO");
    }
  });
}
