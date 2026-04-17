import pool from "../../config/db.js";

export async function searchTransactions(
  description,
  typeTransaction,
  categoryTransaction,
  dateStart,
  dateEnd,
  userId,
) {
  let query = `
    SELECT 
      t.*,
      to_char(t.due_date, 'DD/MM/YYYY') as due_date,
      c.*
    FROM transactions t
    INNER JOIN categories c 
      ON c.category_id = t.category_id
    WHERE 1=1 
  `;
  if (!userId) {
    throw new Error("UserId é obrigatório");
  }
  const values = [];
  let index = 1;

  if (description) {
    query += `
      AND unaccent(lower(t.description))
      LIKE unaccent(lower('%' || $${index} || '%'))
    `;
    values.push(description);
    index++;
  }
  query += ` AND t.user_id = $${index}`;
  values.push(userId);
  index++;

  if (typeTransaction && typeTransaction !== "all") {
    query += ` AND c.type = $${index}`;
    values.push(typeTransaction);
    index++;
  }

  if (categoryTransaction && categoryTransaction !== "all") {
    query += ` AND c.category_id = $${index}`;
    values.push(categoryTransaction);
    index++;
  }

  if (dateStart) {
    query += ` AND t.due_date >= $${index}`;
    values.push(dateStart);
    index++;
  }

  if (dateEnd) {
    query += ` AND t.due_date < ($${index}::date + INTERVAL '1 day')`;
    values.push(dateEnd);
    index++;
  }

  const result = await pool.query(query, values);
  return result.rows;
}

export async function getTransactions({ month, year, userId }) {
  const result = await pool.query(
    `
SELECT 
  TO_CHAR(COALESCE(l.due_date, t.due_date), 'DD/MM/YYYY') AS due_date,
  t.transaction_id,
  c.name,
  t.description,
  c.type AS typeCategory,

  CASE 
    WHEN i.installment_amount IS NOT NULL THEN i.installment_amount
    ELSE t.amount
  END AS amount,

  c.color,
  c.icon,
  t.status,
  p.name AS pmethod,
  c.type,
  i.total_installments,
  i.installment_amount

FROM TRANSACTIONS t
LEFT JOIN INSTALLMENTS_PLAN i 
  ON i.transaction_id = t.transaction_id
LEFT JOIN INSTALLMENTS l 
  ON l.plan_id = i.plan_id 
INNER JOIN categories c 
  ON t.category_id = c.category_id
INNER JOIN payment_methods p 
  ON t.payment_method_id = p.payment_method_id 

WHERE 
  EXTRACT(MONTH FROM COALESCE(l.due_date, t.due_date)) = $1
  AND EXTRACT(YEAR FROM COALESCE(l.due_date, t.due_date)) = $2
  AND t.user_id = $3

ORDER BY c.name;`,
    [month, year, userId],
  );
  return result.rows;
}

export async function consultCategory(transaction_id, userId) {
  const result = await pool.query(
    `SELECT c.type AS tipo
FROM transactions AS t INNER JOIN  categories AS c
ON t.category_id = c.category_id
WHERE t.transaction_id = $1 AND t.user_id = $2
`,
    [transaction_id, userId],
  );
  return result.rows[0]?.tipo || null;
}

export async function consultStatus(transaction_id, userId) {
  const result = await pool.query(
    `SELECT status FROM transactions  WHERE transaction_id = $1 AND user_id=$2`,
    [transaction_id, userId],
  );

  return result.rows[0]?.status || null;
}
