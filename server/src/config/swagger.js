import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gcash",
      version: "1.0.0",
      description: "Documentação da minha API",
    },
  },
  apis: ["./src/routes/*.js"], // arquivos onde estarão as rotas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
