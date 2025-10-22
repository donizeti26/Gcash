const pool = require("../config/db");

async function getTransactions() {
  const result = await pool.query(`
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
INNER JOIN payment_methods AS p ON t.payment_method_id = p.payment_method_id`);
  return result.rows;
}
async function registerTransactions({
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

async function editTransactions({ transaction_id }) {
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

  console.log("ID recebido:", transaction_id); // 🧠 ADICIONE ISSO
  console.log("Resultado da query:", result.rows); // 🧠 ADICIONE ISSO
  return result.rows[0] || null;
}

async function updateStatus({ transaction_id, status }) {
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

async function consultStatus({ transaction_id }) {
  const result = await pool.query(
    `
      SELECT status FROM transactions  WHERE transaction_id = $1`,
    [transaction_id]
  );
  console.log("ID da transação: ", transaction_id);
  console.log("Resultado da Query: ", result.rows);
  return result.rows[0]?.status || null;
}

async function sumTransactions({ month, year }) {
  const result = await pool.query(
    "SELECT SUM(amount) AS total_month FROM transactions WHERE EXTRACT(MONTH FROM due_date)=$1 AND EXTRACT(YEAR FROM due_date) = $2",
    [month, year]
  );

  return { total: Number(result.rows[0]?.total) || 0 };
}

async function pendingTransactions({ month, year }) {
  const result = await pool.query(
    `SELECT SUM(amount) AS totaldevendo
FROM transactions
WHERE status = 'peding' AND
EXTRACT(MONTH FROM due_date) = $1 AND EXTRACT(YEAR FROM due_date) = $2`,
    [month, year]
  );

  console.log(result.rows);

  return { total: Number(result.rows[0]?.total) || 0 };
}

async function paidTransactions({ month, year }) {
  const result = await pool.query(
    `SELECT SUM(amount) AS totalpago
FROM transactions
WHERE status = 'paid' AND
EXTRACT(MONTH FROM due_date) = $1  AND EXTRACT(YEAR FROM due_date) = $2`,
    [month, year]
  );

  console.log(result.rows);

  return { total: Number(result.rows[0]?.total) || 0 };
}

module.exports = {
  getTransactions,
  editTransactions,
  updateStatus,
  consultStatus,
  sumTransactions,
  pendingTransactions,
  paidTransactions,
  registerTransactions,
};
