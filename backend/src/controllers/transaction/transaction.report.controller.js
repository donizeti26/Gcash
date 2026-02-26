import {
  sumTransactions,
  sumTransactionsRevenue,
  pendingTransactions,
  paidTransactions,
  countTransactions,
} from "../../models/transaction/index.js";

export async function reportsController(req, res) {
  try {
    const userId = req.userId;

    const { month, year, type } = req.query; // ?month=1&year=2025&type=pending
    if (!month || !year) {
      return res.status(400).json({ message: "Mês e ano são obrigatórios" });
    }

    let data;
    switch (type) {
      case "revenue":
        data = await sumTransactionRevenueController(month, year, userId);
        break;
      case "pending":
        data = await pendingTransactionsController(month, year, userId);
        break;
      case "paid":
        data = await paidTransactionsController(month, year, userId);
        break;
      case "sumMonth":
        data = await sumTransactionController(month, year, type, userId);
      case "sumYear":
        data = await sumTransactionController(month, year, type, userId);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function sumTransactionController(month, year, type, userId) {
  const data = await sumTransactions({ month, year, type, userId });
  return data;
}
async function sumTransactionRevenueController(month, year, userId) {
  const data = await sumTransactionsRevenue({ month, year, userId });
  return data;
}
async function pendingTransactionsController(month, year, userId) {
  const data = await pendingTransactions({ month, year, month, year, userId });
  return data;
}

async function paidTransactionsController(month, year, userId) {
  console.log("Mês e ano recebidos:", month, year);
  const data = await paidTransactions({ month, year, userId });
  return data;
}

export async function countTransactionsController(req, res) {
  try {
    const { id, month } = req.query;
    const userId = req.userId;
    if (!id && !month)
      return res.status(400).json({ message: "ID ou MES é obrigatório" });

    if (id && !month) {
      const data = await countTransactions({ id, userId });
      res.status(200).json(data);
    } else if (!id && month) {
      const data = await countTransactions({ month, userId });
      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Erro ao contar Transações : ", error);
    res.status(500).json({ error: error.message });
  }
}
