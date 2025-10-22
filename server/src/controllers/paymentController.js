import getPaymentMethodsModel from "../models/paymentMethodModel";

export async function getPaymentMethodsController(req, res) {
  try {
    const data = await getPaymentMethodsModel();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar métodos de pagamento", err);
    res.status(500).json({ error: err.message });
  }
}
