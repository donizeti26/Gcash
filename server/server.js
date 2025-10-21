const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();
const port = 3000;
console.log("userRoutes:", typeof userRoutes);
console.log("categoryRoutes:", typeof categoryRoutes);
console.log("paymentRoutes:", typeof paymentRoutes);
console.log("transactionRoutes:", typeof transactionRoutes);
// middlewares
app.use(cors());
app.use(express.json());
//servir arquivos estatitucos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});
// Usa o arquivo de rotas
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", paymentRoutes);
app.use("/api", transactionRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
