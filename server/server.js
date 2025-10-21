const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

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
