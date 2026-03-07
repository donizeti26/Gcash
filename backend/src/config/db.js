import pkg from "pg";

const { Pool } = pkg;
// conexão com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log(process.env.DB_USER + " As");

export default pool;
