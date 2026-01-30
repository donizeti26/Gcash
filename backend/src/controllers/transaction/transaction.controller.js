import {
  editTransactions,
  updateTransactions,
  updateStatus,
  updateTransactionsByCategory,
  registerTransactions,
  deleteTransactions,
} from "../../models/transaction/index.js";

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
    if (!transaction_id) {
      return res.status(400).json({ error: "ID da transação não informado" });
    }
    console.log("ID recebido no controller:", transaction_id);

    const data = await editTransactions(transaction_id);

    if (!data) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao editar transação:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateTransactionsController(req, res) {
  try {
    console.log("REQ PARAMS:", req.params);
    console.log("REQ BODY:", req.body);

    const { transaction_id } = req.params;
    const { action } = req.query;

    if (transaction_id === "bulk" && action === "change-category") {
      return updateSingleTransaction(req, res);
    }
    return updateByCategory(req, res);
  } catch (err) {
    console.error("Erro ao atualizar transação: aaa", err);
    res.status(500).json({ err: "Erro interno no servidor" });
  }
}

async function updateByCategory(req, res) {
  const { transaction_id } = req.params;

  const {
    category_id,
    payment_method_id,
    due_date,
    amount,
    description,
    status,
    type,
  } = req.body;

  if (!transaction_id) {
    return res.status(400).json({ error: "transaction_id é obrigatório" });
  } else if (type == "expense" && amount > 0) {
    return res.status(400).json({
      message: "Para Expenses/despesas o valor tem que ser negativo",
    });
  }
  await updateTransactions(
    transaction_id,
    category_id,
    payment_method_id,
    due_date,
    amount,
    description,
    status,
    type,
  );

  return res.status(200).json({ message: "Atualizado com sucesso" });
}

async function updateSingleTransaction(req, res) {
  const { categoria_origem_id, categoria_destino_id } = req.body;

  await updateTransactionsByCategory(categoria_origem_id, categoria_destino_id);

  return res.status(200).json({ message: "Atualizado com sucesso" });
}

export async function updateStatusController(req, res) {
  console.log("req.body:", req.body);
  try {
    const { transaction_id } = req.params; // vem da URL
    const { status } = req.body; // vem do corpo
    const data = await updateStatus(transaction_id, status);
    console.log("Status atualizado com sucesso");

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao alterar status: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTransactionsController(req, res) {
  try {
    const { transaction_id } = req.params;
    const deletedCount = await deleteTransactions(transaction_id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }

    res.json({ message: "Transação removida com sucesso!" });
  } catch (err) {
    console.error("Erro ao apagar transação: ", err);
    res.status(500).json({ error: err.message });
  }
}
