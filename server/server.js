// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Importando rotas
import transactionRoutes from "./src/routes/transactionRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

// Criando __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors()); // se precisar de CORS
app.use(express.json()); // para interpretar JSON do body
app.use(express.urlencoded({ extended: true })); // interpretar form data

// Static folder (arquivos públicos)
app.use(express.static(path.join(__dirname, "../public")));

// Rotas
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/paymentmethods", paymentRoutes);

// Rota teste
app.get("/", (req, res) => {
  res.send("Servidor rodando corretamente!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
