import { renderCards, listenerButtons, renderButtons } from "./sharedUtils.js";
import { apiFetch } from "../api.js";

import { countTransaction } from "./transactionsUtils.js";

export async function getParamsForSearch() {
  const formSearchIndex = document
    .getElementById("form_search")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("search_input").value;
      const typeTransaction =
        document.getElementById("search_description").value;

      const categoryTransaction =
        document.getElementById("search_category").value;

      const periodString = document.getElementById("daterange").value;

      const [dateStart, dateEnd] = periodString.split(" - ");
      searchWithParams(
        description,
        typeTransaction,
        categoryTransaction,
        dateStart,
        dateEnd,
      );
      console.log(description, typeTransaction, categoryTransaction);
    });
}

async function searchWithParams(
  description,
  typeTransaction,
  categoryTransaction,
  dateStart,
  dateEnd,
) {
  const params = new URLSearchParams();

  if (description) params.append("description", description);
  if (typeTransaction) params.append("typeTransaction", typeTransaction);
  if (categoryTransaction)
    params.append("categoryTransaction", categoryTransaction);
  if (dateStart) params.append("dateStart", dateStart);
  if (dateEnd) params.append("dateEnd", dateEnd);

  try {
    const response = await apiFetch(`/transactions?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    console.log("RETORNO COMPLETO:", data);
    console.log("TOTAL:", data.length);
    console.log("TIPO:", typeof data);
    console.log("É array?", Array.isArray(data));

    const group_cards = document.getElementById("group_cards");
    const totalPages = Math.ceil(data.length / 5);

    if (group_cards) {
      group_cards.innerHTML = "";
    }
    renderCards(data, 1);
    renderButtons(totalPages, 1);
    listenerButtons(data, 1, 7, totalPages);

    setNumCards({ total: data.length, currentPage: 1 });
    console.log("LINHA ACIMA EXECULTADA  𒉭");

    if (data.length == 0) {
      const groupCards = document.getElementById("group_cards");
      const resultSearch = document.createElement("p");
      groupCards.innerHTML = "";
      resultSearch.id = "result_search";
      resultSearch.innerHTML = `    <img id="img_cant_find" src="/images/cant_find.svg">
    Nenhum resultado específico encontrado...</p>`;
      groupCards.appendChild(resultSearch);
    }
  } catch (err) {
    console.error("Erro ao buscar transações" + err);
  }
}

export async function setNumCards({
  month = null,
  total = null,
  currentPage = 1,
}) {
  console.log("LINHA ACIMA EXECULTADA  𒉭");

  const totalTransactions = document.getElementById("resultResume");

  const totalResult = document.createElement("p");
  let resultEnd = 0;

  // Se não recebeu o total, busca no banco
  if (total === null && month !== null) {
    console.log("★ Buscando total no banco...");
    total = await countTransaction(month + 1);
  }

  if (total == 0) {
    resultEnd = 0;
  } else if (total < 5) {
    resultEnd = total;
    console.log(currentPage);
  } else if (currentPage * 5 < total && currentPage * 5 - total < 0) {
    resultEnd = currentPage * 5;
  } else {
    resultEnd = total;
  }

  if (total == 1) {
    totalResult.textContent = `${resultEnd}/${total} resultado`;
  } else {
    totalResult.textContent = `${resultEnd}/${total} resultados`;
  }
  totalTransactions.innerHTML = "";
  totalTransactions.appendChild(totalResult);
}
