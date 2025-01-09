import path from "node:path";
import { Router } from "express";
import { createBook } from "./bookController";
import multer from "multer";

const bookRouter = Router();

const multerBookMiddlewareFileUpload = multer({
  dest: path.resolve(__dirname, "../../public/storage/books-uploads"),
  limits: { fileSize: 3e7 },
});
// Routes
bookRouter.post(
  "/",
  multerBookMiddlewareFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  createBook
);

export default bookRouter;
