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
let cont = 0; // começa em Janeiro

export function setupCalendar() {
  const inputDataExpenses = document.getElementById("data");
  if (inputDataExpenses) {
    inputDataExpenses.addEventListener(
      "click",
      () => {
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
  // Atualiza mes na sidbar
  function showMonth() {
    months.innerHTML = " <h2> " + month[cont] + "</h2>";
    console.log(month[cont]);
  }
  // Avançar (GO)
  GO.addEventListener("click", () => {
    cont = (cont + 1) % 12; // avança e volta para 0 quando passa de 11
    showMonth();
  });
  // Voltar (Back)
  BACK.addEventListener("click", () => {
    cont = (cont - 1 + 12) % 12; // se for -1, vira 11 (Dezembro)
    showMonth();
  });

  // Mostra o primeiro mês ao carregar
  showMonth();
}
