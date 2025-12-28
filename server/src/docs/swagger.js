import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      description:
        "Plataforma online para gerenciamento de receitas e despesas pessoais. Registro de gastos com categorias, valores, parcelas,status,etc, resumo mensal dos gastos,etc. Com o objetivo de facilitar o planejamento financeiro e o controle do orçamento futuro.",
      version: "1.0.0",
      contact: {
        email: "https://www.linkedin.com/in/donizeti-silva-a666b31b0/",
      },
    },

    servers: [
      {
        url: "localhost:3000/api/",
      },
    ],
  },
  apis: ["./src/routes/**/*.js", "./src/docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
