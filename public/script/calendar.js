import {
  sumAmountMonth,
  sumAtualMonthPaid,
  sumAtualMonthPeding,
  sumAmountMonthRevenue,
} from "./installments.js";

import { LoadExpenses } from "./index.js";
/*==========================
        Controlador de meses
===========================*/

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
const GO = document.getElementById("GO");
const BACK = document.getElementById("BACK");
const months = document.getElementById("month");

const dataAtual = new Date();
const mesAtual = dataAtual.getMonth();
const anoAtual = dataAtual.getFullYear();
let ContMonth = mesAtual; // começa em Janeiro
let ContYear = anoAtual;
export function setupCalendar() {
  // Atualiza mes na sidbar
  setAtualMonth();

  // Avançar (GO)
  GO.addEventListener("click", () => {
    ContMonth = ContMonth + 1;
    console.log("AAAAAAAAAAAAvançando mês, índice atual:", ContMonth);
    if (ContMonth >= 12) {
      ContMonth = 0;
      ContYear = ContYear + 1;
      console.log(ContYear);
    }
    showMonth();
    sumAmountMonth(ContMonth, ContYear);
    sumAmountMonthRevenue(ContMonth, ContYear);
    sumAtualMonthPaid(ContMonth, ContYear);
    sumAtualMonthPeding(ContMonth, ContYear);
    LoadExpenses(ContMonth, ContYear);
  });
  // Voltar (Back)
  BACK.addEventListener("click", () => {
    ContMonth = ContMonth - 1;
    console.log("AAAAAAAAAvançando mês, índice atual:", ContMonth);
    if (ContMonth < 0) {
      ContMonth = 11;
      ContYear = ContYear - 1;
      console.log(ContYear);
    }
    showMonth();
    sumAmountMonth(ContMonth, ContYear);
    sumAtualMonthPaid(ContMonth, ContYear);
    sumAtualMonthPeding(ContMonth, ContYear);
    sumAmountMonthRevenue(ContMonth, ContYear);
    LoadExpenses(ContMonth, ContYear);
  });

  // Mostra o primeiro mês ao carregar
  showMonth();
}
export function showMonth() {
  months.innerHTML = ` <h2 data-id=${ContMonth} id="month_index" > ${month[ContMonth]}</h2><br><h2 data-id =${ContYear} id="year_index"> ${ContYear}</h2>`;
  sumAmountMonth(ContMonth, ContYear);
  sumAtualMonthPaid(ContMonth, ContYear);
  sumAtualMonthPeding(ContMonth, ContYear);
  sumAmountMonthRevenue(ContMonth, ContYear);

  console.log("TESTGE" + month[ContMonth]);
}

export function setAtualMonth() {
  const inputDataExpenses = document.getElementById("due_date");
  if (inputDataExpenses) {
    inputDataExpenses.addEventListener(
      "click",
      () => {
        console.log("%%%FYB%%%");
        inputDataExpenses.value = "";

        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        const dateFormated = `${year}-${month}-${day}`;
        inputDataExpenses.value = dateFormated;
      },
      {
        once: true,
      }
    );
  }
}
