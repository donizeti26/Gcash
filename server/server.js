import express from "express";
import cors from "cors";
import path from "path";

import userRoutes from "./src/routes/userRoutes";
import categoryRoutes from "./src/routes/categoryRoutes";
import paymentRoutes from "./src/routes/paymentRoutes";
import transactionRoutes from "./src/routes/transactionRoutes";

const app = express();
const port = 3000;

// middlewares
app.use(cors());
app.use(express.json());
//servir arquivos estatitucos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
// Usa o arquivo de rotas
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/paymentmethods", paymentRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
