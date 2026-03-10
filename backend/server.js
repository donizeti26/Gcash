import app from "./src/app.js";
app.get("/", (req, res) => {
  res.send("API Gcash funcionando 🚀");
});
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
