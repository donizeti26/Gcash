// server.js
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Importando rotas

import routes from "./routes/index.js";

// Criando __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder (arquivos estáticos)
app.use(express.static(path.join(__dirname, "../../public")));

// Rotas da API
app.use("/api", routes);
//Rota Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rotas Web
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/login.html"));
});

export default app;
