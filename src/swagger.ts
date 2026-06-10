import path from "path";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load(
  path.resolve(__dirname, "../docs/swagger.yaml"),
);

export default function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
