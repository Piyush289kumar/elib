import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required...");
    return next(error);
  }

  // Process || Logic
  const user = await userModel.findOne({ email: email });

  if (user) {
    const error = createHttpError(400, "User Already Exits with this email..");
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userModel.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  // Response

  res.json({ id: newUser._id });
};

export { createUser };
