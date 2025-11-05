import pool from "../config/db.js";

export async function getPaymentMethodsModelExpense() {
  const result = await pool.query("SELECT * FROM payment_methods");
  return result.rows;
}
export async function getPaymentMethodsModelRevenue() {
  const result = await pool.query(`
    SELECT * 
FROM payment_methods 
WHERE name IN ('Dinheiro', 'Pix');`);
  return result.rows;
}
