import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  // Validation

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required...");
    return next(error);
  }

  // Process || Logic

  // Response

  res.json({ message: "User Created..." });
};

export { createUser };
