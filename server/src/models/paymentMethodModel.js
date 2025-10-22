import pool from "../config/db.js";
export async function getPaymentMethodsModel() {
  const result = await pool.query("SELECT * FROM payment_methods");
  return result.rows;
}
