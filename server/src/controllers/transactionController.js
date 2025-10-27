import {
  getTransactions,
  editTransactions,
  updateStatus,
  consultStatus,
  sumTransactions,
  pendingTransactions,
  paidTransactions,
  registerTransactions,
} from "../models/TransacaoModel.js";

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

export async function createTransactionController(req, res) {
  try {
    const data = await registerTransactions(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Erro ao cadastrar  transação", err);
    res.status(500).json({ error: err.message });
  }
}

export async function editTransactionsController(req, res) {
  try {
    const { transaction_id } = req.params;

    console.log("ID recebido no controller:", transaction_id);

    if (!transaction_id) {
      return res.status(400).json({ error: "ID da transação não informado" });
    }

    const data = await editTransactions(transaction_id);
    console.log("Resultado da Query:", data);

    if (!data) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao editar transação:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateStatusController(req, res) {
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

export async function consultStatusController(req, res) {
  try {
    const { transaction_id } = req.params;
    const data = await consultStatus(transaction_id);
    res.json(data);
  } catch (err) {
    console.error("Erro ao consulltar status: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function sumTransactionController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await sumTransactions({ month, year });
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function pendingTransactionsController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await pendingTransactions({ month, year });
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function paidTransactionsController(req, res) {
  try {
    const { month, year } = req.params;
    console.log("Mês e ano recebidos:", month, year);
    const data = await paidTransactions({ month, year });
    res.json(data);
  } catch (err) {
    console.error("Erro ao somar as transações: ", err);
    res.status(500).json({ error: err.message });
  }
}
