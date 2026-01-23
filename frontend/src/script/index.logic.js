import { overflowHidden } from "../script/utils/modalUtils.js";
import {
  sumAtualMonthPaid,
  resumeMonthInsert,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
  sumAmountYear,
} from "../script/utils/formTransactionsUtils.js";
import { LoadExpenses } from "../script/utils/sharedUtils.js";
import { insertCountTransaction } from "../script/utils/transactionsUtils.js";
import { showToast } from "../script/utils/modalUtils.js";
import { showLoading, hideLoading } from "../script/utils/loadingUtils.js";

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
export async function loadComponentsHome(monthIndex, yearIndex) {
  await sumAmountYear(monthIndex, yearIndex);
  await sumAtualMonthPaid(monthIndex, yearIndex);
  await resumeMonthInsert(monthIndex, yearIndex);
  await sumAmountMonthRevenue(monthIndex, yearIndex);
  await sumAtualMonthPending(monthIndex, yearIndex);
  await LoadExpenses(monthIndex, yearIndex);
  await insertCountTransaction(monthIndex);
}

export async function SetStatusInTransactions(id) {
  const current = getCurrentMonthYear();
  if (!current) return;

  const { monthIndex, yearIndex } = current;
  const ConfirmStatus = await showConfirm({
    message: "Você quer realmente alterar o status da transação?",
    theme: "warning",
  });

  if (!ConfirmStatus) {
    return;
  }

  try {
    showLoading();
    const currentStatus = await consultStatus(id);
    const statusString = currentStatus.status || currentStatus;
    const newStatus = statusString === "paid" ? "pending" : "paid";

    const response = await fetch(`/api/transactions/${id}/statusUpdate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar status");
    await LoadExpenses(monthIndex, yearIndex);
  } catch (err) {
    console.error("Erro ao atualizar status da transação" + err);
  } finally {
    showToast("Operação concluída com Sucesso", 3000);

    hideLoading();
  }
}
export async function consultStatus(id) {
  try {
    const response = await fetch(`/api/transactions/${id}/status`);
    const status = await response.json(); // status agora é diretamente a string "paid" ou "pending"

    console.log("Status da transação", id, "é", status);
    return status;
  } catch (err) {
    console.error("Error ao consultar status: ", err.message);
    return null;
  }
}
