import app from "./src/app.js";
import pool from "./db.js";
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("Banco conectado:", res.rows);
  })
  .catch((err) => {
    console.error("Erro conexão banco:", err);
  });
