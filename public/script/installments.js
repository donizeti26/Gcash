// agora o HTML já está dentro do modalContainer

export function initExpensesForm() {
  const question_repet = document.getElementById("question_repet");
  var valueEvent;
  if (question_repet) {
    const radios = question_repet.querySelectorAll(
      'input[name="reponse_radio"]'
    );

    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        valueEvent = parseInt(e.target.value);
        console.log("Usuário escolheu:", typeof e.target.value, valueEvent);
        onofOption();
      });
    });

    installments = document.getElementById("installments");

    function createInstallments() {
      installments.innerHTML = "";
      for (var i = 1; i <= 12; i++) {
        console.log(i);
        var option = document.createElement("option");
        option.value = i;
        option.text = "Em " + i + "x";

        installments.appendChild(option);
      }
    }
    function onofOption() {
      if (valueEvent === 0) {
        installments.disabled = true;
      } else if (valueEvent === 1) {
        installments.disabled = false;

        createInstallments();
      }
    }
  }
}
