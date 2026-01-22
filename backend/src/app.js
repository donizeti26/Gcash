// server.js
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
// Importando rotas

import routes from "./routes/index.js";
import { setupSwagger } from "./docs/swagger.js";

// Criando __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", routes);

setupSwagger(app);
export default app;
