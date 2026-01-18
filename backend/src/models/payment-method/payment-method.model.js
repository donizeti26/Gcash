import pool from "../../config/db.js";

export async function getPaymentMethodsModel(type) {
  if (type === "expense") {
    const result = await pool.query("SELECT * FROM payment_methods");
    return result.rows;
  } else if (type === "revenue") {
    const result = await pool.query(`
    SELECT * 
FROM payment_methods 
WHERE name IN ('Dinheiro', 'Pix');`);
    /*Gambiarra: caso que o clinte Só receba esses dois meios de pagamento (SISTEMA PESSOAL) */
    return result.rows;
  } else {
  }
}
