import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./bookModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({ message: "OK" });
};

export { createBook };
