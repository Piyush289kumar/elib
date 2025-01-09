import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./bookModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Files : ", req.files);

  const file = req.files as { [filename: string]: Express.Multer.File[] };
  // Cover Image Upload
  let coverImageUploadResult;
  try {
    const coverImageMimeType = file.coverImage[0].mimetype.split("/").at(-1);
    const coverImageFileName = file.coverImage[0].filename;
    const coverImageFilePath = path.resolve(
      __dirname,
      "../../public/storage/books-uploads",
      coverImageFileName
    );
    coverImageUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "eblib-api/books/coverImages",
        format: coverImageMimeType,
      }
    );
  } catch (error) {
    console.log(error);
  }

  // Book PDF Upload
  let bookPdfFileUploadResult;
  try {
    const bookPdfFileMimeType = file.pdfFile[0].mimetype.split("/").at(-1);
    const bookPdfFileFileName = file.pdfFile[0].filename;
    const bookPdfFileFilePath = path.resolve(
      __dirname,
      "../../public/storage/books-uploads",
      bookPdfFileFileName
    );
    bookPdfFileUploadResult = await cloudinary.uploader.upload(
      bookPdfFileFilePath,
      {
        resource_type: "raw",
        filename_override: bookPdfFileFileName,
        folder: "eblib-api/books/bookPdfFiles",
        format: bookPdfFileMimeType,
      }
    );
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({ coverImageUploadResult, bookPdfFileUploadResult });
};

export { createBook };
