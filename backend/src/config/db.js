import pkg from "pg";

const { Pool } = pkg;
// conexão com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
console.log("DATABASE_URL carregada:", !!process.env.DATABASE_URL);

export default pool;
