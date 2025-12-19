import { LoadExpenses } from "./index.js";
import { closeModal } from "./modalUtils.js";
import { showMonth } from "./calendarUtils.js";

export function initExpensesForm() {
  const question_repeated = document.getElementById("question_repeated");
  var valueEvent;
  if (question_repeated) {
    const radios = question_repeated.querySelectorAll(
      'input[name="response_radio"]'
    );

    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        valueEvent = parseInt(e.target.value);
        onOfOption();
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
    function onOfOption() {
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
        const response = await fetch("/api/transactions/", {
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
          alert("Transação cadastrada com sucesso!");
        } else {
          alert("Erro: " + data.error);
        }

        closeModal();
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
//////carregando dados de método de pagamento para form.///////////
////////////////////////////////////////////////////////////////////////////////

//CARREGANDO MÉTODOS DE PAGAMENTO REVENUE

export async function loadPaymentMethodsRevenue() {
  try {
    const response = await fetch("/api/payment-methods?type=revenue");
    const paymentMethods = await response.json();
    const selectPayment = document.getElementById("payment_method_id");

    if (selectPayment) {
      selectPayment.innerHTML = `<option value="" disabled="" selected="">Selecionar</option>`;
    }

    paymentMethods.data.forEach((cat) => {
      const item = document.createElement("option");

      item.value = cat.payment_method_id; // ou cat.id (depende do nome da coluna no banco)
      item.textContent = cat.name; // certifique-se do nome correto da coluna

      if (selectPayment) {
        selectPayment.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar métodos de pagamento", err);
  }
}

//CARREGANDO métodos DE PAGAMENTO REVENUE

export async function loadPaymentMethodsExpense() {
  try {
    const response = await fetch("/api/payment-methods?type=expense");

    const paymentMethods = await response.json();
    console.warn(paymentMethods.message);
    const selectPayment = document.getElementById("payment_method_id");

    if (selectPayment) {
      selectPayment.innerHTML = `<option value="" disabled="" selected="">Selecionar</option>`;
    }

    paymentMethods.data.forEach((cat) => {
      const item = document.createElement("option");

      item.value = cat.payment_method_id; // ou cat.id (depende do nome da coluna no banco)
      item.textContent = cat.name; // certifique-se do nome correto da coluna

      if (selectPayment) {
        selectPayment.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar métodos de pagamento", err);
  }
}

//////////////////////////////////////////
/////////////TOTAL DO ME2S///////////
//////////////////////////////////////////
export async function sumAmountMonth(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const response = await fetch(
      `/api/transactions/reports?month=${month}&year=${yearIndex}&type=sum`
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
    console.error("Erro ao carregar total transações front", err);
  }
}

//////////////////////////////////////////
/////////////receita  DO MES///////////
//////////////////////////////////////////
export async function sumAmountMonthRevenue(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const response = await fetch(
      `/api/transactions/reports?month=${month}&year=${yearIndex}&type=pending`
    );
    const transactionsSum = await response.json();

    const total_month = document.getElementById("month_revenue");

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
    console.error("Erro ao carregar total transações front", err);
  }
}

export async function sumAtualMonthPaid(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    console.log("Month no front:", month);
    console.log("Year no front:", yearIndex);
    const response = await fetch(
      `/api/transactions/reports?month=${month}&year=${yearIndex}&type=paid`
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

export async function sumAtualMonthPending(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const response = await fetch(
      `/api/transactions/reports?month=${month}&year=${yearIndex}&type=revenue`
    );

    const transactionsSumPending = await response.json();
    console.log("TUDO OK AQUI");

    const amount_pending = document.getElementById("amount_pending");

    if (amount_pending) {
      const total = Number(transactionsSumPending.total) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      amount_pending.textContent = `${convertAmount}`;
      console.log(`Total não pago no mes de ${month} foi de ${total}`);
    }
  } catch (err) {
    console.error("Erro ao inserir soma total do mes atual", err);
  }
}
