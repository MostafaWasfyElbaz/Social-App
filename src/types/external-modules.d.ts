declare module "swagger-ui-express" {
  import { RequestHandler } from "express";

  export const serve: RequestHandler;
  export function setup(swaggerDocument: unknown, options?: unknown): RequestHandler;

  const swaggerUi: {
    serve: RequestHandler;
    setup: typeof setup;
  };

  export default swaggerUi;
}

declare module "yamljs" {
  const YAML: {
    load(path: string): unknown;
  };

  export default YAML;
}
