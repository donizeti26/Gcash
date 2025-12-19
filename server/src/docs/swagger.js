import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      description:
        "This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more ab",
      version: "1.0.0",
      contact: {
        email: "https://www.linkedin.com/in/donizeti-silva-a666b31b0/",
      },
    },

    servers: [
      {
        url: "/api/",
      },
    ],
  },
  apis: ["./src/routes/**/*.js", "./src/docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
