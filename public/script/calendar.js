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
let ContMonth = 0; // começa em Janeiro

export function setupCalendar() {
  const inputDataExpenses = document.getElementById("due_date");
  if (inputDataExpenses) {
    inputDataExpenses.addEventListener(
      "click",
      () => {
        console.log("testamdp");
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
    months.innerHTML = " <h2> " + month[ContMonth] + "</h2>";
    console.log(month[ContMonth]);
  }
  // Avançar (GO)
  GO.addEventListener("click", () => {
    ContMonth = ContMonth + 1;
    if (ContMonth >= 12) {
      ContMonth = 0;
    }
    showMonth();
  });
  // Voltar (Back)
  BACK.addEventListener("click", () => {
    ContMonth = ContMonth - 1;
    if (ContMonth < 0) {
      ContMonth = 11;
    }
    showMonth();
  });

  // Mostra o primeiro mês ao carregar
  showMonth();
}
