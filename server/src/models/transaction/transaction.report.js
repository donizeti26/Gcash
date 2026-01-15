import pool from "../../config/db.js";

export async function sumTransactions({ year }) {
  const query = `
SELECT
    COALESCE(SUM(t.amount) FILTER (WHERE c.type IN ('revenue','expense')), 0)
    AS total_month
FROM transactions t
JOIN categories c ON c.category_id = t.category_id
WHERE t.status = 'paid' AND EXTRACT(YEAR FROM t.due_date) = $1;
`;
  const result = await pool.query(query, [year]);
  console.log("Resultado da Query RESUMO ANUAL:", result.rows);

  return { total: Number(result.rows[0]?.total_month) || 0 };
}

export async function sumTransactionsRevenue({ month, year }) {
  const query = `SELECT SUM(t.amount) AS total_month
FROM transactions as t 
inner join categories as c on 
 t.category_id = c.category_id where
EXTRACT(MONTH FROM due_date)=$1
AND EXTRACT(YEAR FROM due_date) = $2 and c.type = 'revenue'`;
  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query RECEBIDOS MENSAL:", result.rows);

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
  console.log("Resultado da Query DESPESAS ATIVAS:", result.rows);

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

  const result = await pool.query(query, [month, year]);
  console.log("Resultado da Query DESPESAS PAGAS:", result.rows);

  return { total: Number(result.rows[0]?.total) || 0 };
}

export async function countTransactions({ id, month }) {
  if (id) {
    const query = `SELECT COUNT(*) AS total_transactions FROM transactions AS t INNER JOIN categories AS c ON t.category_id = c.category_id WHERE t.category_id = $1 `;
    const result = await pool.query(query, [id]);
    return { total: Number(result.rows[0]?.total_transactions) || 0 };
  } else if (month) {
    const query = `SELECT COUNT(*) AS total_transactions FROM transactions WHERE EXTRACT(MONTH FROM due_date)= $1 `;
    const result = await pool.query(query, [month]);
    return { total: Number(result.rows[0]?.total_transactions) || 0 };
  }
}
