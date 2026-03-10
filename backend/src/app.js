import "dotenv/config";
// server.js
import express from "express";
import cors from "cors";

import pool from "./db.js";
// Importando rotas

import routes from "./routes/index.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", routes);

setupSwagger(app);
app.get("/", (req, res) => {
  res.send("API Gcash funcionando 🚀");
});

app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no banco");
  }
});
export default app;
