import { overflowHidden } from "../script/utils/modalUtils.js";

export function getCurrentMonthYear() {
  const monthEl = document.getElementById("month_index");
  const yearEl = document.getElementById("year_index");

  if (!monthEl || !yearEl) {
    console.warn("month_index ou year_index ainda não existem no DOM");
    return null;
  }

  return {
    monthIndex: Number(monthEl.dataset.id),
    yearIndex: Number(yearEl.dataset.id),
  };
}

export function showConfirm({ message, theme }) {
  return new Promise((resolve) => {
    overflowHidden(true);

    const modal = document.getElementById("confirm_modal");
    const ConfirmTitle = document.getElementById("confirm_title");
    const bodyModal = document.getElementById("body_modal");
    const buttonConfirm = document.getElementById("confirm_yes");
    const iconModal = document.querySelector("#icon_modal");

    modal.classList.remove("*");

    modal.className = "modal_box";
    modal.classList.add(theme);
    buttonConfirm.classList.add(theme);
    iconModal.classList.add(theme);

    switch (theme) {
      case "danger":
        iconModal.classList.remove("warning");
        buttonConfirm.classList.remove("warning");
        iconModal.textContent = "delete_forever";
        ConfirmTitle.textContent = "Deletar Transação";
        buttonConfirm.textContent = "Sim, Deletar.";
        break;
      case "warning":
        iconModal.classList.remove("danger");
        buttonConfirm.classList.remove("danger");
        iconModal.textContent = "compare_arrows";
        ConfirmTitle.textContent = "Alterar Status";
        buttonConfirm.textContent = "Sim, Alterar.";
        break;
    }

    const btnYes = modal.querySelector("#confirm_yes");
    modal.querySelector("#confirm_message").textContent = message;
    bodyModal.classList.remove("hidden");

    btnYes.onclick = () => {
      bodyModal.classList.add("hidden");
      resolve(true);
    };

    modal.querySelector("#confirm_no").onclick = () => {
      bodyModal.classList.add("hidden");
      resolve(false);
    };

    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") {
          bodyModal.classList.add("hidden");
          resolve(false);
        }
      },
      { once: true },
    );
  });
}
