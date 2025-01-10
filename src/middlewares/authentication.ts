import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  loginUserID: string;
}

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authenticationToken = req.header("Authorization");

  if (!authenticationToken) {
    return next(createHttpError(401, "Authorization Token is Required."));
  }

  try {
    const authenticationParsedToken = authenticationToken.split(" ")[1];

    const authenticationTokenDecode = jwt.verify(
      authenticationParsedToken,
      config.jwt_secret as string
    );
    const _req = req as AuthRequest;
    _req.loginUserID = authenticationTokenDecode.sub as string;
    next();
  } catch (error) {
    return next(createHttpError(401, "Authorization Token is Expaired."));
  }
};

export default authentication;
