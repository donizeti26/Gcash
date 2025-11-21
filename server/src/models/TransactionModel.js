import pool from "../config/db.js";

export async function getTransactions({ month, year }) {
  const result = await pool.query(
    `
SELECT TO_CHAR(t.due_date, 'DD/MM/YYYY') AS due_date,
t.transaction_id  AS transaction_id ,
c.name AS name,
t.description AS description,
t.amount as amount,
c.color  as color,
c.icon as icon,
t.status as status,
p.name as pmethod,
c.type as type
from transactions AS t

INNER JOIN categories
AS c ON t.category_id = c.category_id
INNER JOIN payment_methods AS p ON t.payment_method_id = p.payment_method_id
  WHERE EXTRACT(MONTH FROM due_date) = $1 and  EXTRACT(YEAR FROM due_date) = $2`,
    [month, year]
  );
  return result.rows;
}
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

export async function consultCategory(transaction_id) {
  const result = await pool.query(
    `SELECT c.type AS tipo
FROM transactions AS t INNER JOIN  categories AS c
ON t.category_id = c.category_id
WHERE t.transaction_id = $1
`,
    [transaction_id]
  );
  console.log("ID da transação: ", transaction_id);
  console.log("Resultado da Query: ", result.rows);
  return result.rows[0]?.tipo || null;
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

  console.log("ID recebido:", transaction_id);
  console.log("Resultado da query:", result.rows);
  return result.rows[0] || null;
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

export async function consultStatus(transaction_id) {
  const result = await pool.query(
    `
      SELECT status FROM transactions  WHERE transaction_id = $1`,
    [transaction_id]
  );
  console.log("ID da transação: ", transaction_id);
  console.log("Resultado da Query: ", result.rows);
  return result.rows[0]?.status || null;
}

export async function sumTransactions({ month, year }) {
  const query = `
SELECT SUM(t.amount) AS total_month
FROM transactions as t 
inner join categories as c on 
 t.category_id = c.category_id where
EXTRACT(MONTH FROM due_date)=$1
AND EXTRACT(YEAR FROM due_date) = $2 and c.type = 'expense'`;
  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query (total do mes):", result.rows);

  return { total: Number(result.rows[0]?.total_month) || 0 };
}

export async function pendingTransactions({ month, year }) {
  const query = `SELECT SUM(amount) AS total
FROM transactions as t
inner join categories as c on
 t.category_id = c.category_id
WHERE status = 'pending' AND
EXTRACT(MONTH FROM due_date) = $1 AND EXTRACT(YEAR FROM due_date) = $2  and c.type = 'expense'`;
  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query (total pendente):", result.rows);

  console.log(result.rows);

  return { total: Number(result.rows[0]?.total) || 0 };
}

export async function paidTransactions({ month, year }) {
  const query = `SELECT SUM(amount) AS total
FROM transactions as t
inner join categories as c on
 t.category_id = c.category_id
WHERE status = 'paid' AND
EXTRACT(MONTH FROM due_date) = $1 AND EXTRACT(YEAR FROM due_date) = $2  and c.type = 'expense'`;

  console.log(">>> DEBUG pendingTransactions");
  console.log("Mês recebido:", month, "Tipo:", typeof month);
  console.log("Ano recebido:", year, "Tipo:", typeof year);
  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query (total pago):", result.rows);
  console.log(result.rows);

  return { total: Number(result.rows[0]?.total) || 0 };
}

export async function deleteTransactions(id) {
  const query = "DELETE FROM transactions WHERE transaction_id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount;
}

export async function sumTransactionsRevenue({ month, year }) {
  const query = `SELECT SUM(t.amount) AS total_month
FROM transactions as t 
inner join categories as c on 
 t.category_id = c.category_id where
EXTRACT(MONTH FROM due_date)=$1
AND EXTRACT(YEAR FROM due_date) = $2 and c.type = 'revenue'`;
  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query (total do mes):", result.rows);

  return { total: Number(result.rows[0]?.total_month) || 0 };
}
