import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "./config/config";

const app = express();

// Rotues
// Https Method -> GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res, next) => {
  res.json({ message: "Server is Running.." });
});

// Global Error Handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.node_env === "Local" ? err.stack : "",
  });
});

export default app;
