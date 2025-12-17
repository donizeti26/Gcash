import {
  sumTransactions,
  sumTransactionsRevenue,
  pendingTransactions,
  paidTransactions,
  countTransactions,
} from "../../models/transaction/index.js";

export async function reportsController(req, res) {
  try {
    const { month, year, type } = req.query; // ?month=1&year=2025&type=pending
    if (!month || !year) {
      return res.status(400).json({ message: "Mês e ano são obrigatórios" });
    }

    let data;
    switch (type) {
      case "revenue":
        data = await sumTransactionRevenueController(month, year);
        break;
      case "pending":
        data = await pendingTransactionsController(month, year);
        break;
      case "paid":
        data = await paidTransactionsController(month, year);
        break;
      default:
        data = await sumTransactionController(month, year);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function sumTransactionController(month, year) {
  const data = await sumTransactions({ month, year });
  return data;
}
async function sumTransactionRevenueController(month, year) {
  const data = await sumTransactionsRevenue({ month, year });
  return data;
}
async function pendingTransactionsController(month, year) {
  const data = await pendingTransactions({ month, year });
  return data;
}

async function paidTransactionsController(month, year) {
  console.log("Mês e ano recebidos:", month, year);
  const data = await paidTransactions({ month, year });
  return data;
}

export async function countTransactionsController(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "ID é obrigatório" });

    const data = await countTransactions({ id });
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao somar as Receitas : ", error);
    res.status(500).json({ error: error.message });
  }
}
