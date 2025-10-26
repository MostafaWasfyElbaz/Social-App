import express from "express";
import dotenv from "dotenv";
import path from "path";
import baseRouter from "./routes";
import { IError } from "./common/index";
import { NextFunction, Request, Response } from "express";
import { DBConnection } from "./DB/DBConnection";
import cors from "cors";
import { initialization } from "./modules/gateway/gateway";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
dotenv.config({
  path: path.resolve("./src/config/.env"),
});

const app = express();

export const bootstrap = async (): Promise<void> => {
  app.use(cors());
  await DBConnection();
  app.use(express.json());
  app.use("/api/v1", baseRouter);
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "query",
      fields: {
        hello: {
          type: GraphQLString,
          resolve: () => "Hello World",
        },
      },
    }),
  })
  app.use("/graphql", createHandler({schema}))
  app.use("/{*dummy}", (req, res) => {
    res.status(404).json({
      message: "Page not found",
    });
  });
  app.use(
    (
      err: IError,
      req: Request,
      res: Response,
      next: NextFunction
    ): Response => {
      return res.status(err.statusCode || 500).json({
        message: err.message,
        status: err.statusCode || 500,
        stack: err.stack,
      });
    }
  );
  const httpServer = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
  });

await initialization(httpServer);
};
