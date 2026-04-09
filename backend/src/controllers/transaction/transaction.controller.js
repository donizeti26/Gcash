import {
  editTransactions,
  updateTransactions,
  updateStatus,
  updateTransactionsByCategory,
  registerTransactions,
  deleteTransactions,
} from "../../models/transaction/index.js";

import { createInstallmentPlan } from "../../services/transaction.service.js";

console.error("CONTROLLER CARREGADO COM SUCESSO");

export async function createTransactionController(req, res) {
  console.error("APARECEU AQUI DENTRO DA FUNCAO");

  try {
    const userId = req.userId;
    const {
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      isInstallment,
      numInstallment,
      status,
    } = req.body;
    console.log("isInstallment recebido:", isInstallment, typeof isInstallment);
    console.log("numInstallment recebido:", numInstallment);
    if (!due_date)
      return res.status(400).json({ error: "due_date é obrigatório" });

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount))
      return res.status(400).json({ error: "Valor inválido" });

    // Criação da transação principal
    const transaction = await registerTransactions(
      userId,
      category_id,
      payment_method_id,
      due_date,
      parsedAmount,
      description,
      status,
    );

    // Verificação de parcelamento (aceita 1, "1" ou true)
    if (String(isInstallment) === "1" || isInstallment === true) {
      await createInstallmentPlan({
        transactionId: transaction.transaction_id, // Certifique-se que o Model retorna isso
        total: parsedAmount,
        installments: Number(numInstallment),
        startDate: due_date,
      });
    }

    return res.status(201).json(transaction);
  } catch (err) {
    console.error("Erro ao cadastrar transação:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function editTransactionsController(req, res) {
  try {
    const userId = req.userId;
    const { transaction_id } = req.params;
    if (!transaction_id) {
      return res.status(400).json({ error: "ID da transação não informado" });
    }
    console.log("ID recebido no controller:", transaction_id);

    const data = await editTransactions(transaction_id, userId);

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

  const userId = req.userId;

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
    userId,
  );

  return res.status(200).json({ message: "Atualizado com sucesso" });
}

async function updateSingleTransaction(req, res) {
  const { categoria_origem_id, categoria_destino_id } = req.body;

  const userId = req.userId;

  await updateTransactionsByCategory(
    categoria_origem_id,
    categoria_destino_id,
    userId,
  );

  return res.status(200).json({ message: "Atualizado com sucesso" });
}

export async function updateStatusController(req, res) {
  console.log("req.body:", req.body);
  try {
    const userId = req.userId;

    const { transaction_id } = req.params; // vem da URL
    const { status } = req.body; // vem do corpo
    const data = await updateStatus(transaction_id, status, userId);
    console.log("Status atualizado com sucesso");

    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao alterar status: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTransactionsController(req, res) {
  try {
    const userId = req.userId;
    const { transaction_id } = req.params;
    const deletedCount = await deleteTransactions(transaction_id, userId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }

    res.json({ message: "Transação removida com sucesso!" });
  } catch (err) {
    console.error("Erro ao apagar transação: ", err);
    res.status(500).json({ error: err.message });
  }
}
