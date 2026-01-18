import pool from "../../config/db.js";

export async function registerTransactions({
  category_id,
  payment_method_id,
  due_date,
  amount,
  description,
  status,
}) {
  const result = await pool.query(
    "INSERT INTO transactions (category_id, payment_method_id, due_date, amount, description, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [category_id, payment_method_id, due_date, amount, description, status]
  );
  return result.rows[0];
}

export async function editTransactions(transaction_id) {
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
p.payment_method_id as payment_method_id
from transactions AS t

INNER JOIN categories
AS c ON t.category_id = c.category_id
INNER JOIN payment_methods AS p ON t.payment_method_id = p.payment_method_id where t.transaction_id = $1`,
    [transaction_id]
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
  status
) {
  await pool.query(
    `UPDATE transactions
  SET category_id = $1, payment_method_id = $2, due_date = $3,
amount = $4, description=$5, status=$6
  where transaction_id = $7`,
    [
      category_id,
      payment_method_id,
      due_date,
      amount,
      description,
      status,
      transaction_id,
    ]
  );
  return { message: "Transação atualizado" };
}

export async function updateStatus(transaction_id, status) {
  await pool.query(
    `
      UPDATE transactions
  SET status = $1
  where transaction_id = $2
  `,
    [status, transaction_id]
  );
  return { message: "Status atualizado", newStatus: status };
}

export async function deleteTransactions(id) {
  const query = "DELETE FROM transactions WHERE transaction_id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount;
}
