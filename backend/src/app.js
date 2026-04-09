import "dotenv/config";
// server.js
import express from "express";
import cors from "cors";

import pool from "./config/db.js";
// Importando rotas

import routes from "./routes/index.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();
console.log("APP.JS CARREGADO COM SUCESSO");
// Middlewares globais
app.use(
  cors({
    origin: ["http://localhost:5173", "https://gcash-ten.vercel.app"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", routes);

setupSwagger(app);
app.get("/", (req, res) => {
  res.send("API Gcash funcionando 🚀");
});
app.get("/ping", (req, res) => {
  res.send("pong");
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
