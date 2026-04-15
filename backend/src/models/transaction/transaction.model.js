import pool from "../../config/db.js";

export async function registerTransactions(
  userId,
  category_id,
  payment_method_id,
  due_date,
  amount,
  description,
  status,
) {
  const result = await pool.query(
    "INSERT INTO transactions (user_id, category_id, payment_method_id, due_date, amount, description, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      userId,
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      status,
    ],
  );
  return result.rows[0];
}
export async function createPlan(transactionId, totalInstallments, amount) {
  const result = await pool.query(
    `INSERT INTO INSTALLMENTS_PLAN 
    (TRANSACTION_ID, TOTAL_INSTALLMENTS, INSTALLMENT_AMOUNT)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [transactionId, totalInstallments, amount],
  );

  return result.rows[0];
}

export async function createInstallment(planId, number, amount, dueDate) {
  await pool.query(
    `INSERT INTO INSTALLMENTS 
    (PLAN_ID, INSTALLMENT_NUMBER, AMOUNT, DUE_DATE)
    VALUES ($1, $2, $3, $4)`,
    [planId, number, amount, dueDate],
  );
}

export async function editTransactions(transaction_id, userId) {
  const result = await pool.query(
    `
SELECT TO_CHAR(t.due_date, 'DD/MM/YYYY') AS due_date,
t.transaction_id  AS transaction_id ,
c.category_id AS category_id,
t.description AS description,
t.amount as amount,
c.color  as color,
c.icon as icon,
t.status as status,
p.payment_method_id as payment_method_id,
i.total_installments as total_installments,
i.installment_amount as installment_amount
  
FROM TRANSACTIONS AS T 
  LEFT JOIN INSTALLMENTS_PLAN  AS I 
  ON I.TRANSACTION_ID = T.TRANSACTION_ID 
  INNER JOIN categories
  AS c ON t.category_id = c.category_id
  INNER JOIN payment_methods AS p 
  ON t.payment_method_id = p.payment_method_id 
  WHERE T.TRANSACTION_ID =$1 AND t.user_id = $2`,
    [transaction_id, userId],
  );

  return result.rows[0] || null;
}

export async function updateTransactions(
  transaction_id,
  category_id,
  payment_method_id,
  due_date,
  amount,
  description,
  status,
  userId,
) {
  await pool.query(
    `UPDATE transactions
  SET category_id = $1, payment_method_id = $2, due_date = $3,
amount = $4, description= $5, status= $6
  WHERE transaction_id = $7 and user_id=$8`,
    [
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      status,
      transaction_id,
      userId,
    ],
  );
  return { message: "Transação atualizado" };
}

export async function updateTransactionsByCategory(
  categoria_origem_id,
  categoria_destino_id,
  userId,
) {
  const query = `UPDATE transactions
  SET category_id = $2
  WHERE category_id = $1 AND user_id = $3`;
  const result = await pool.query(query, [
    categoria_origem_id,
    categoria_destino_id,
    userId,
  ]);

  return { message: "Status atualizado", result };
}

export async function updateStatus(transaction_id, status, userId) {
  await pool.query(
    `
      UPDATE transactions
  SET status = $1
  WHERE transaction_id = $2 AND user_id=$3
  `,
    [status, transaction_id, userId],
  );
  return { message: "Status atualizado", newStatus: status };
}

export async function deleteTransactions(id, userId) {
  const query =
    "DELETE FROM transactions WHERE transaction_id = $1 and user_id=$2";
  const result = await pool.query(query, [id, userId]);
  return result.rowCount;
}
