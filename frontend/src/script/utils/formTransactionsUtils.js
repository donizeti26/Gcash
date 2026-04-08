import { closeModal, showToast } from "./modalUtils.js";
import { showMonth } from "./calendarUtils.js";
import { loadComponentsHome } from "../index.logic.js";
import { apiFetch } from "../api.js";

export function initExpensesForm() {
  const question_repeated = document.getElementById("question_repeated");
  var valueEvent;
  if (question_repeated) {
    const radios = question_repeated.querySelectorAll(
      'input[name="response_radio"]',
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
//////captura os dados do formulário e faz o apiFetch pro back.////////
//////////////////////////////////////////////////////////////////////////

export async function initTransactionForm(type) {
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

      const radioSelected = document.querySelector(
        'input[name="response_radio"]:checked',
      );
      if (!radioSelected) {
        alert("Selecione se é parcelado ou não");
        return;
      }
      const select = document.getElementById("installments");

      const isInstallment = parseInt(radioSelected.value);
      const numInstallment = parseInt(select.value);

      const statusElement = document.querySelector(
        'input[name="response_status"]:checked',
      );
      const status = statusElement?.value || null;

      console.log(
        "NUMERO DE PARCELAS :" +
          numInstallment +
          " VAI PARCELAR : " +
          isInstallment,
      );

      let amountNumber = amount.replace(/[R$.]/g, "").replace(",", ".");
      amountNumber = parseFloat(amountNumber);

      if (isNaN(amountNumber)) {
        alert("Valor inválido");
        return;
      }
      if (!due_date) {
        alert("Data de vencimento é obrigatória");
        return;
      }

      console.log("Due Date enviada:", due_date);

      if (isInstallment === 1 && (!numInstallment || numInstallment <= 0)) {
        alert("Número de parcelas é obrigatório");
        return;
      }
      if (isInstallment === undefined || isNaN(isInstallment)) {
        alert("Definição se é parcela ou não é obrigatória");
        return;
      }

      if (type === "expense") {
        if (amountNumber <= 0) {
          alert("O valor deve ser maior que zero");
          return;
        }
        amountNumber *= -1;
      }
      try {
        const token = localStorage.getItem("token");

        const response = await apiFetch("/transactions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category_id,
            payment_method_id,
            due_date,
            amount: amountNumber,
            description,
            isInstallment,
            numInstallment,
            status,
          }),
        });

        const data = await response.json();
        console.log("Resposta do servidor: ", data);

        if (response.ok) {
          showToast("Operação concluída com Sucesso", 3000);
          console.log("TUDO OK POR AQUI");
        } else {
          alert("Erro: " + data.error);
        }

        closeModal();
      } catch (err) {
        console.error("Erro no Front: ", err);
        alert("Erro ao enviar transação");
      } finally {
        console.log("AQUI");
        const month = document.getElementById("month_index");
        const year = document.getElementById("year_index");
        const monthIndex = Number(month.dataset.id);
        const year_index = Number(year.dataset.id);
        await loadComponentsHome(monthIndex, year_index);
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
    const response = await apiFetch("/payment-methods?type=revenue");
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
    const response = await apiFetch("/payment-methods?type=expense");

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
/////////////TOTAL DO ANO///////////
//////////////////////////////////////////
export async function sumAmountYear(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  const type = "sumYear";
  try {
    const response = await getResume(month, yearIndex, type);

    const total_year = document.getElementById("total_year");

    if (total_year) {
      const total = Number(response) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      total_year.textContent = `${convertAmount}`;
      console.log(`Total transações no mes ${monthIndex}: `, total);
      console.log(`Total transações`, total);
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
  const token = localStorage.getItem("token");
  try {
    const response = await apiFetch(
      `/transactions/reports?month=${month}&year=${yearIndex}&type=revenue`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const transactionsSum = await response.json();

    const total_year = document.getElementById("month_revenue");

    if (total_year) {
      const total = Number(transactionsSum.total) || 0;
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      total_year.textContent = `${convertAmount}`;
      console.log(`Total gastos no mes de ${monthIndex}: `, total);
    }
  } catch (err) {
    console.error("Erro ao carregar total transações front", err);
  }
}

export async function getTransactionsTotal(monthIndex, yearIndex, type) {
  try {
    console.log("Month no front:", monthIndex);
    console.log("Year no front:", yearIndex);

    const token = localStorage.getItem("token");

    const response = await apiFetch(
      `/transactions/reports?month=${monthIndex}&year=${yearIndex}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const transactionsSumPaid = await response.json();
    return Number(transactionsSumPaid.total) || 0;
  } catch (err) {
    console.error("Erro ao BUSCAR soma total do mes atual", err);
  }
}

export async function sumAtualMonthPaid(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  try {
    const total = await getTransactionsTotal(month, yearIndex, "paid");

    const amount_paid = document.getElementById("amount_paid");

    if (amount_paid) {
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
    const total = await getTransactionsTotal(month, yearIndex, "pending");

    const amount_pending = document.getElementById("amount_pending");

    if (amount_pending) {
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

export async function getResume(month, year, type) {
  try {
    const token = localStorage.getItem("token");
    const response = await apiFetch(
      `/transactions/reports?month=${month}&year=${year}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const totalResumeMonth = await response.json();

    console.log("RESUMO MENSAL" + totalResumeMonth.total);

    return Number(totalResumeMonth.total) || 0;
  } catch (err) {
    console.error("Erro ao BUSCAR soma total do mes atual", err);
  }
}

export async function resumeMonthInsert(monthIndex, yearIndex) {
  const month = monthIndex + 1;
  const year = yearIndex;
  const type = "sumMonth";

  try {
    const total = await getResume(month, year, type);
    const calc_resume_month = document.getElementById("calc_resume_month");

    if (calc_resume_month) {
      const convertAmount = Number(total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      calc_resume_month.textContent = `${convertAmount}`;
      console.log(`Total de RESUMO no mes de ${month} foi de ${total}`);
    }
  } catch (err) {
    console.error("Erro ao inserir resumo total do mes atual", err);
  }
}
