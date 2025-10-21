const {
  getTransactions,
  editTransactions,
  updateStatus,
  consultStatus,
  sumTransactions,
  pendingTransactions,
  paidTransactions,
  registerTransactions,
} = require("../models/TransacaoModel");

async function getTransactionsController(req, res) {
  try {
    const data = await getTransactions();
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar  transação");
    res.status(500).json({ error: err.message });
  }
}

async function createTransactionController(req, res) {
  try {
    const data = await registerTransactions(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Erro ao cadastrar  transação", err);
    res.status(500).json({ error: err.message });
  }
}

async function editTransactionsController(req, res) {
  try {
    const { transaction_id } = req.params;
    const data = await editTransactions(transaction_id, req.body);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao editar transação: ", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateStatusController(req, res) {
  try {
    const { transaction_id } = req.params; // vem da URL
    const { status } = req.body; // vem do corpo
    const data = await updateStatus(transaction_id, status);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao alterar status: ", err);
    res.status(500).json({ error: err.message });
  }
}

async function consultStatusController(req, res) {
  try {
    const { transaction_id } = req.params;
    const data = await consultStatus(transaction_id);
    res.json(data);
  } catch (err) {
    console.error("Erro ao consulltar status: ", err);
    res.status(500).json({ error: err.message });
  }
}

async function sumTransactionController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await sumTransactions(month, year);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}

async function pendingTransactionsController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await pendingTransactions(month, year);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}

async function paidTransactionsController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await paidTransactions(month, year);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getTransactionsController,
  createTransactionController,
  editTransactionsController,
  updateStatusController,
  consultStatusController,
  sumTransactionController,
  pendingTransactionsController,
  paidTransactionsController,
};
