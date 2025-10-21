const pool = require("../config/db");
async function getPaymentMethodsModel() {
  const result = await pool.query("SELECT * FROM payment_methods");
  return result.rows;
}
module.exports = {
  getPaymentMethodsModel,
};
