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
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config({
  path: path.resolve("./src/config/.env"),
});

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

export const bootstrap = async (): Promise<void> => {
  const app = express();
  app.use(cors(), express.json(), helmet());
  await DBConnection();
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
  });
  app.use("/graphql", createHandler({ schema }));
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
