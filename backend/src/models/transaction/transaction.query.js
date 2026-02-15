import pool from "../../config/db.js";

export async function searchTransactions(
  description,
  typeTransaction,
  categoryTransaction,
  dateStart,
  dateEnd,
) {
  const result = await pool.query(
    `
SELECT * 
FROM transactions as t
INNER JOIN categories AS c 
  ON c.category_id = t.category_id 
WHERE unaccent(lower(t.description)) 
      LIKE unaccent(lower('%' || $1 || '%'))
  AND c.type = $2
  AND c.category_id = $3
  AND t.due_date >= $4
  AND t.due_date < ($5::date + INTERVAL '1 day')`,
    [description, typeTransaction, categoryTransaction, dateStart, dateEnd],
  );
  return result.rows;
}

export async function getTransactions({ month, year }) {
  const result = await pool.query(
    `
SELECT TO_CHAR(t.due_date, 'DD/MM/YYYY') AS due_date,
t.transaction_id  AS transaction_id ,
c.name AS name,
t.description AS description,
c.type as typeCategory,
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
  WHERE EXTRACT(MONTH FROM due_date) = $1 and  EXTRACT(YEAR FROM due_date) = $2 ORDER BY c.name`,
    [month, year],
  );
  return result.rows;
}

export async function consultCategory(transaction_id) {
  const result = await pool.query(
    `SELECT c.type AS tipo
FROM transactions AS t INNER JOIN  categories AS c
ON t.category_id = c.category_id
WHERE t.transaction_id = $1
`,
    [transaction_id],
  );
  return result.rows[0]?.tipo || null;
}

export async function consultStatus(transaction_id) {
  const result = await pool.query(
    `
      SELECT status FROM transactions  WHERE transaction_id = $1`,
    [transaction_id],
  );

  return result.rows[0]?.status || null;
}
