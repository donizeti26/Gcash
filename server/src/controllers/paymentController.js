import {
  getPaymentMethodsModelExpense,
  getPaymentMethodsModelRevenue,
} from "../models/paymentMethodModel.js";

export async function getPaymentMethodsExpensesController(req, res) {
  try {
    const data = await getPaymentMethodsModelExpense();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar métodos de pagamento", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getPaymentMethodsRevenueController(req, res) {
  try {
    const data = await getPaymentMethodsModelRevenue();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar métodos de pagamento", err);
    res.status(500).json({ error: err.message });
  }
}
