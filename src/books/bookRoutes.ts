import path from "node:path";
import { Router } from "express";
import { createBook, updateBook } from "./bookController";
import multer from "multer";
import authentication from "../middlewares/authentication";

const bookRouter = Router();

const multerBookMiddlewareFileUpload = multer({
  dest: path.resolve(__dirname, "../../public/storage/books-uploads"),
  limits: { fileSize: 1e7 },
});
// Routes
bookRouter.post(
  "/",
  authentication,
  multerBookMiddlewareFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authentication,
  multerBookMiddlewareFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  updateBook
);
export default bookRouter;
