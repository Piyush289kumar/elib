import { Response, Request, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message,
    errorStack: config.node_env === "Local" ? err.stack : "",
  });
};

export default globalErrorHandler;
