import { createPlan, createInstallment } from "../models/transaction/index.js";

export async function createInstallmentPlan({
  transactionId,
  total,
  installments,
  startDate,
}) {
  if (!transactionId) throw new Error("transactionId é obrigatório");
  if (!installments || installments <= 0)
    throw new Error("Número de parcelas inválido");
  if (total === 0) throw new Error("O valor não pode ser zero");

  // Trabalhamos com o valor absoluto para o cálculo e guardamos o sinal
  const isNegative = total < 0;
  const absoluteTotal = Math.abs(total);

  const baseValue = Math.floor((absoluteTotal / installments) * 100) / 100;
  const remainder =
    Math.round((absoluteTotal - baseValue * installments) * 100) / 100;

  const plan = await createPlan(
    transactionId,
    installments,
    isNegative ? -baseValue : baseValue,
  );

  const initialDate = new Date(startDate + "T00:00:00");

  for (let i = 1; i <= installments; i++) {
    let amount = baseValue;
    if (i === installments) amount += remainder;

    // Aplica o sinal original (positivo ou negativo)
    const finalAmount = isNegative ? -amount : amount;

    const dueDate = new Date(initialDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    await createInstallment(plan.plan_id, i, finalAmount, dueDate);
  }

  return { planId: plan.plan_id, totalInstallments: installments };
}
