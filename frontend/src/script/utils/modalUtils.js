export function closeModal() {
  document.getElementById("modalContainer").innerHTML = "";
  overflowHidden(false);
}

export function closeSubModal() {
  document.getElementById("modalContainerListCategories").innerHTML = "";
  overflowHidden(false);
}
export function setupModalGlobalListeners() {
  console.log("★ setupModalGlobalListeners");
  const modalContainer = document.getElementById("modalContainer");

  // ESC para FECHAR
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  const toggle = document.querySelector(".switch input");

  const isChecked = localStorage.getItem("toggle") === "checked";
  toggle.checked = isChecked;
  applyDarkMode(isChecked);

  toggle.addEventListener("change", () => {
    const checked = toggle.checked;

    applyDarkMode(checked);

    if (checked) {
      localStorage.setItem("toggle", "checked");
    } else {
      localStorage.removeItem("toggle");
    }
  });
  // CLICK GLOBAL (delegação)
  document.addEventListener("click", (e) => {
    // botão fechar
    const NewModalJs = e.target.closest(".modal_overlay_form");
    const formCard = e.target.closest(".modal_container_form");

    if (e.target.closest(".button_close_card")) {
      console.log("★ button_close_card");
      e.stopPropagation(); // importante
      closeModal();
      return;
    }

    if (e.target.closest(".button_close_card_new_category")) {
      console.log("★ button_close_card_new_category");
      e.stopPropagation(); // importante
      document.getElementById("modalContainerListCategories").innerHTML = "";
      overflowHidden(false);
      return;
    }
    if (formCard) {
      console.log("filho");
      return;
    } else if (NewModalJs) {
      console.log("pai");
      closeModal();
    }
  });
}

export function applyDarkMode(enabled) {
  document.body.classList.toggle("dark_mode", enabled);
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
