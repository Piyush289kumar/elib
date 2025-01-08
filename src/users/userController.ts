import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required...");
    return next(error);
  }

  // Process || Logic
  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const error = createHttpError(
        400,
        "User Already Exits with this email.."
      );
      return next(error);
    }
  } catch (err) {
    return next(
      createHttpError(
        500,
        "Error at Finding User With Email : File => userController.ts"
      )
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  try {
    newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(
      createHttpError(
        500,
        "Error at Creating New User : File => userController.ts"
      )
    );
  }

  const token = sign({ sub: newUser._id }, config.jwt_secret as string, {
    expiresIn: "7d",
  });
  // Response

  res.json({ token });
};

export { createUser };
