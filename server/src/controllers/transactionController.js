import {
  getTransactions,
  editTransactions,
  consultCategory,
  updateTransactions,
  updateStatus,
  consultStatus,
  sumTransactions,
  sumTransactionsRevenue,
  pendingTransactions,
  paidTransactions,
  registerTransactions,
  deleteTransactions,
  countTransactions,
} from "../models/TransactionModel.js";

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
    const {
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      status,
    } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ error: "transaction_id é obrigatório" });
    }

    await updateTransactions(
      transaction_id,
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      status
    );

    return res.status(200).json({ message: "Atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar transação: ", err);
    res.status(500).json({ err: "Erro interno no servidor" });
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
    console.error("Erro ao consultar status: ", err);
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

export async function deleteTransactionsController(req, res) {
  try {
    const { transaction_id } = req.params;
    const deletedCount = await deleteTransactions(transaction_id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }

    res.json({ message: "Transação apagada com sucesso!" });
  } catch (err) {
    console.error("Erro ao apagar transação: ", err);
    res.status(500).json({ error: err.message });
  }
}

export async function sumTransactionRevenueController(req, res) {
  try {
    const { month, year } = req.params;
    const data = await sumTransactionsRevenue({ month, year });
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao somar as Receitas : ", error);
    res.status(500).json({ error: error.message });
  }
}

export async function countTransactionsController(req, res) {
  try {
    const { id } = req.params;
    const data = await countTransactions({ id });
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao somar as Receitas : ", error);
    res.status(500).json({ error: error.message });
  }
}
