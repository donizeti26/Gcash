import { LoadExpenses } from "./index.js";
import { fecharModal } from "./modal.js";
import { showMonth } from "./calendar.js";
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
        installments.value = 1;
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

      const statusElement = document.querySelector(
        'input[name="response_status"]:checked'
      );
      const status = statusElement?.value || null;

      let amountNumber = amount.replace(/[R$.]/g, "").replace(",", ".");
      amountNumber = parseFloat(amountNumber);
      try {
        const response = await fetch("/api/transactions/transactions", {
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

        fecharModal();
      } catch (err) {
        console.error("Erro no Front: ", err);
        alert("Erro ao enviar transação");
      } finally {
        const month = document.getElementById("month_index");
        const year = document.getElementById("year_index");
        const monthIndex = Number(month.dataset.id);
        const year_index = Number(year.dataset.id);
        LoadExpenses(monthIndex, year_index);

        showMonth();
      }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////
//////carregando dados de metodo de pagamento para form.///////////
////////////////////////////////////////////////////////////////////////////////

//CARREGANDO METODOS DE PAGAMENTO

export async function loadPaymentMethods() {
  try {
    const response = await fetch("/api/paymentmethods/paymentmethods");
    const paymentmethods = await response.json();

    const selectPayment = document.getElementById("payment_method_id");

    if (selectPayment) {
      selectPayment.innerHTML = `<option value="" disabled="" selected="">Selecionar</option>`;
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

//CARREGANDO CATEGORIAS  DESPESAS

export async function loadCategoryForm() {
  try {
    const response = await fetch("/api/categories/categoriesExpense");
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

//////////////////////////////////////////
/////////////TOTAL DO MES///////////
//////////////////////////////////////////
export async function sumAmountMonth(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const response = await fetch(
      `/api/transactions/transactions/sum/${month}/${yearIndex}`
    );
    const transactionsSum = await response.json();

    const total_month = document.getElementById("total_month");

    if (total_month) {
      const total = Number(transactionsSum.total) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      total_month.textContent = `${convertAmount}`;
      console.log(`Total gastos no mes de ${monthIndex}: `, total);
    }
  } catch (err) {
    console.error("Erro ao carregar total transacoes front", err);
  }
}

export async function sumAtualMonthPaid(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    console.log("Month no front:", month);
    console.log("Year no front:", yearIndex);
    const response = await fetch(
      `/api/transactions/transactions/paid/${month}/${yearIndex}`
    );

    const transactionsSumPaid = await response.json();
    console.log("TUDO OK AQUI");

    const amount_paid = document.getElementById("amount_paid");

    if (amount_paid) {
      const total = Number(transactionsSumPaid.total) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      amount_paid.textContent = `${convertAmount}`;
      console.log(`Total pago no mes ${month} foi de ${total}`);
    }
  } catch (err) {
    console.error("Erro ao inserir soma total do mes atual", err);
  }
}

export async function sumAtualMonthPeding(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const response = await fetch(
      `/api/transactions/transactions/pending/${month}/${yearIndex}`
    );

    const transactionsSumPeding = await response.json();
    console.log("TUDO OK AQUI");

    const amount_peding = document.getElementById("amount_peding");

    if (amount_peding) {
      const total = Number(transactionsSumPeding.total) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      amount_peding.textContent = `${convertAmount}`;
      console.log(`Total não pago no mes de ${month} foi de ${total}`);
    }
  } catch (err) {
    console.error("Erro ao inserir soma total do mes atual", err);
  }
}
