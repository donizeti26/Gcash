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

    const installments = document.getElementById("installments");

    function createInstallments() {
      installments.innerHTML = "";
      for (var i = 1; i <= 12; i++) {
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

////////////////////////////////////////////////////////////////////////////
//////captura os dados do formulário e faz o fetch pro back.////////
//////////////////////////////////////////////////////////////////////////

export async function initTransactionForm() {
  const formTransaction = document.getElementById("form_card");
  if (formTransaction) {
    formTransaction.addEventListener("submit", async (e) => {
      e.preventDefault(); //impede reload da pagina

      //Capturando os valores do HTML
      const category_id = document.getElementById("category_id").value;
      const payment_method_id =
        document.getElementById("payment_method_id").value;
      const due_date = document.getElementById("due_date").value;
      const amount = document.getElementById("amount").value;
      const description = document.getElementById("description").value;

      const status = document.querySelector(
        'input[name="response_status"]:checked'
      ).value;
      let amountNumber = amount.replace(/[R$.]/g, "").replace(",", ".");
      amountNumber = parseFloat(amountNumber);
      try {
        const response = await fetch("/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_id,
            payment_method_id,
            due_date,
            amount: amountNumber,
            description,
            status,
          }),
        });

        const data = await response.json();
        console.log("Resposta do servidor: ", data);

        if (response.ok) {
          alert("Transacção cadastrada com sucesso!");
        } else {
          alert("Erro: " + data.error);
        }
      } catch (err) {
        console.error("Erro no Front: ", err);
        alert("Erro ao enviar transação");
      }
    });
  }
}

////////////////////////////////////////////////////////////////////////////
//////carregando dados de metodo de pagamento para form.////////
//////////////////////////////////////////////////////////////////////////

export async function loadPaymentMethods() {
  try {
    const response = await fetch("/paymentmethods");
    const paymentmethods = await response.json();

    const selectPayment = document.getElementById("payment_method_id");

    if (selectPayment) {
      selectPayment.innerHTML = `<option value="valor1" disabled="" selected="">Selecionar</option>`;
    }

    paymentmethods.forEach((cat) => {
      const item = document.createElement("option");

      item.value = cat.payment_method_id; // ou cat.id (depende do nome da coluna no banco)
      item.textContent = cat.name; // certifique-se do nome correto da coluna

      if (selectPayment) {
        selectPayment.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar metodos de pagamento", err);
  }
}

export async function loadCategoryForm() {
  try {
    const response = await fetch("/categories");
    const categories = await response.json();

    const select = document.getElementById("category_id");

    if (select) {
      select.innerHTML = `<option value="" disabled selected>Selecionar</option>`;
    }

    categories.forEach((cat) => {
      const item = document.createElement("option");
      item.value = cat.category_id;
      item.textContent = cat.name;

      if (select) {
        select.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar categorias", err);
  }
}
