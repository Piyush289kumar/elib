import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Rotues
// Https Method -> GET, POST, PUT, PATCH, DELETE
app.get("/", (req: Request, res, next) => {
  const error = createHttpError(404, "Something went wrong...");
  throw error;
  res.json({ message: "Server is Running.." });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
