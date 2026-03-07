import pkg from "pg";

const { Pool } = pkg;
// conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  connectionString: process.env.DATABASE_URL,
});

console.log(process.env.DB_USER + " As");

export default pool;
