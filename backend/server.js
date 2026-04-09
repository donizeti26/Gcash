import app from "./src/app.js";
console.log("SERVER.JS EXECUTOU COM SUCESSO");
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
