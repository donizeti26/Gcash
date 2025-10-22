import pkg from "pg";
const { Pool } = pkg;
// conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_gcash",
  password: "1995",
  port: 5432,
});

export default pool;
