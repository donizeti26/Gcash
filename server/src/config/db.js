const { Pool } = require("pg");
// conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_gcash",
  password: "1995",
  port: 5432,
});

module.exports = pool;
