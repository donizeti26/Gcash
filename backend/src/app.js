import "dotenv/config";
// server.js
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

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
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
setupSwagger(app);
export default app;
