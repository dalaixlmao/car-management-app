
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Car API Documentation",
    version: "1.0.0",
    description: "API documentation for Car management system",
  },
  servers: [
    {
      url: "/api", // The base path for your APIs
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./pages/api/car/*.ts", // Add all the files where you've defined API routes
    "./pages/api/[...next-auth]/route.tsx", // Auth routes
    "./pages/api/edgestore/[...edgestore]/route.ts", // EdgeStore routes
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerHandler = swaggerUi.serve;
const swaggerDocsHandler = swaggerUi.setup(swaggerSpec);

export { swaggerHandler, swaggerDocsHandler };
