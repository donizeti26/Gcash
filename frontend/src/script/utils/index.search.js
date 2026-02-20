import { renderCards } from "./sharedUtils.js";

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
    const response = await fetch(`/api/transactions?${params}`, {
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

    if (group_cards) {
      group_cards.innerHTML = "";
    }
    renderCards(data);
    setNumCards(data.length);

    if (data.length == 0) {
      const groupCards = document.getElementById("group_cards");
      const resultSearch = document.createElement("p");
      groupCards.innerHTML = "";
      resultSearch.id = "result_search";
      resultSearch.textContent = `Nenhum resultado específico encontrado...`;
      groupCards.appendChild(resultSearch);
    }
  } catch (err) {
    console.error("Erro ao buscar transações" + err);
  }
}

function setNumCards(total) {
  const totalTransactions = document.getElementById("resultResume");
  const totalResult = document.createElement("p");

  if (total == 1) {
    totalResult.textContent = `${total} resultado`;
  } else {
    totalResult.textContent = `${total} resultados`;
  }
  totalTransactions.innerHTML = "";
  totalTransactions.appendChild(totalResult);
}
