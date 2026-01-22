import {
  sumAmountYear,
  sumAtualMonthPaid,
  resumeMonthInsert,
  sumAtualMonthPending,
  sumAmountMonthRevenue,
} from "./formTransactionsUtils.js";

import { insertCountTransaction } from "./transactionsUtils.js";
import { LoadExpenses } from "./sharedUtils.js";

/*/////////////////////////////////////
/////// CONTROLADOR DOS MESES //////////
/////////////////////////////////////*/

const month = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const dataAtual = new Date();
const mesAtual = dataAtual.getMonth();
const anoAtual = dataAtual.getFullYear();

let ContMonth = mesAtual;
let ContYear = anoAtual;

export function setupCalendar() {
  const GO = document.getElementById("GO");
  const BACK = document.getElementById("BACK");
  const months = document.getElementById("month");

  if (!GO || !BACK || !months) {
    console.warn("Calendar ainda não está no DOM");
    return;
  }

  setAtualMonth();
  showMonth();

  // Avançar
  GO.addEventListener("click", () => {
    ContMonth = ContMonth + 1;

    if (ContMonth >= 12) {
      ContMonth = 0;
      ContYear = ContYear + 1;
    }

    showMonth();
    sumAmountYear(ContMonth, ContYear);
    sumAmountMonthRevenue(ContMonth, ContYear);
    sumAtualMonthPaid(ContMonth, ContYear);
    resumeMonthInsert(ContMonth, ContYear);
    sumAtualMonthPending(ContMonth, ContYear);
    LoadExpenses(ContMonth, ContYear);
    insertCountTransaction(ContMonth);
  });

  // Voltar
  BACK.addEventListener("click", () => {
    ContMonth = ContMonth - 1;

    if (ContMonth < 0) {
      ContMonth = 11;
      ContYear = ContYear - 1;
    }

    showMonth();
    sumAmountYear(ContMonth, ContYear);
    sumAmountMonthRevenue(ContMonth, ContYear);
    sumAtualMonthPaid(ContMonth, ContYear);
    resumeMonthInsert(ContMonth, ContYear);
    sumAtualMonthPending(ContMonth, ContYear);
    LoadExpenses(ContMonth, ContYear);
    insertCountTransaction(ContMonth);
  });
}

export function showMonth() {
  const months = document.getElementById("month");
  if (!months) return;

  months.innerHTML = `
    <h2 data-id="${ContMonth}" id="month_index">${month[ContMonth]}</h2>
    <br>
    <h2 data-id="${ContYear}" id="year_index">${ContYear}</h2>
  `;

  sumAmountYear(ContMonth, ContYear);
  sumAtualMonthPaid(ContMonth, ContYear);
  resumeMonthInsert(ContMonth, ContYear);
  sumAtualMonthPending(ContMonth, ContYear);
  sumAmountMonthRevenue(ContMonth, ContYear);
}

export function setAtualMonth() {
  const inputDataExpenses = document.getElementById("due_date");

  if (!inputDataExpenses) return;

  inputDataExpenses.addEventListener(
    "click",
    () => {
      inputDataExpenses.value = "";

      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();

      inputDataExpenses.value = `${year}-${month}-${day}`;
    },
    { once: true },
  );
}
