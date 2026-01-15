export async function openModal(file) {
  const res = await fetch(file);
  overflowHidden(true);
  if (!res.ok) throw new Error(`Falha ao carregar ${file}: ${res.status}`);
  const html = await res.text();
  const modalContainer = document.getElementById("modalContainer");

  if (!modalContainer) throw new Error("#modaContainer não encontrado na DOM");
  modalContainer.innerHTML = html;

  const button_category = document.getElementById("button_category");
  const button_close_card = document.querySelector(".button_close_card");
  const cancelar_create_card = document.getElementById("cancelar_create_card");

  if (button_category) {
    button_category.addEventListener("click", () => {
      openModal("../views/form_category.html");
    });
  }
  if (button_close_card) {
    button_close_card.addEventListener("click", () => {
      closeModal();
    });
  }

  if (cancelar_create_card) {
    cancelar_create_card.addEventListener("click", () => {
      closeModal();
    });
  }
  setupModalGlobalListeners();
  return modalContainer;
}

export function closeModal() {
  document.getElementById("modalContainer").innerHTML = "";
  overflowHidden(false);
}
export function setupModalGlobalListeners() {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  // ESC
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  //fechar ao clicar fora
  document.addEventListener("click", function (e) {
    const new_modal_js = document.getElementById("new_modal_js");
    const resume_month = document.getElementById("resume_month");
    const other_body = document.getElementById("other_body");
    if (
      e.target === new_modal_js ||
      (resume_month && resume_month.contains(e.target)) ||
      (other_body && other_body.contains(e.target))
    ) {
      closeModal();
      console.log("FUNCIONANDO CLICAR FORA");
    }
  });
}
export function overflowHidden(component = true) {
  if (component) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

export function showToast(message, duration) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  const iconSpan = document.createElement("span");
  const textP = document.createElement("p");

  toast.classList.add("toast");
  iconSpan.classList.add("material-symbols-outlined");
  iconSpan.textContent = "check_circle";
  textP.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textP);

  container.appendChild(toast);

  void toast.offsetWidth;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");

    // Remove the element from the DOM after the transition ends (e.g., 500ms from CSS)
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
}
