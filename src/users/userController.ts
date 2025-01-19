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

  const accessToken = sign({ sub: newUser._id }, config.jwt_secret as string, {
    expiresIn: "7d",
  });
  // Response

  res.status(201).json({ accessToken });
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation

  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All Fields are required...");
    return next(error);
  }

  // Process || Logic
  let user;
  try {
    user = await userModel.findOne({ email: email });

    if (!user) {
      const error = createHttpError(404, "User Not Found..");
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
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!isPasswordMatch) {
    return next(createHttpError(401, "Password is Incorrect"));
  }

  const accessToken = sign({ sub: user._id }, config.jwt_secret as string, {
    expiresIn: "7d",
  });
  // Response

  res.status(200).json({ accessToken });
};

export { createUser, loginUser };
