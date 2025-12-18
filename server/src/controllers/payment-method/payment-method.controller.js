import { getPaymentMethodsModel } from "../../models/payment-method/index.js";

export async function getPaymentMethodsController(req, res) {
  const { type } = req.query;
  if (type && !["expense", "revenue"].includes(type)) {
    return res.status(400).json({
      error: "Parâmetro 'type' inválido. Use 'expense' ou 'revenue'.",
    });
  }

  try {
    const data = await getPaymentMethodsModel(type);
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar métodos de pagamento", err);
    res.status(500).json({ error: err.message });
  }
}
