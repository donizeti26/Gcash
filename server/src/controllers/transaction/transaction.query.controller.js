import {
  getTransactions,
  consultCategory,
  consultStatus,
} from "../../models/transaction/index.js";

export async function reportsController(req, res) {
  try {
    const { month, year, type } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Mês e ano são obrigatórios" });
    }

    let data;
    switch (type) {
      case "revenue":
        data = await sumTransactionRevenue(month, year);
        break;
      case "pending":
        data = await pendingTransactions(month, year);
        break;
      case "paid":
        data = await paidTransactions(month, year);
        break;
      default:
        data = await sumTransaction(month, year);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getTransactionsController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await getTransactions({ month, year });
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar  transação");
    res.status(500).json({ error: err.message });
  }
}

export async function consultCategoryController(req, res) {
  try {
    const { transaction_id } = req.params;
    if (!transaction_id) {
      return res.status(400).json({ error: "ID da transação não informado" });
    }

    const data = await consultCategory(transaction_id);

    return res.json({ data });
  } catch (err) {
    console.log("Erro ao consultar categoria para editar", err);
    res.status(500).json({ error: err.message });
  }
}
export async function consultStatusController(req, res) {
  try {
    const { transaction_id } = req.params;
    const status = await consultStatus(transaction_id);
    res.json({ status });
  } catch (err) {
    console.error("Erro ao consultar status: ", err);
    res.status(500).json({ error: err.message });
  }
}
