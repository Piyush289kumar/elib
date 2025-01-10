import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import * as fs from "node:fs";
import { AuthRequest } from "../middlewares/authentication";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const file = req.files as { [filename: string]: Express.Multer.File[] };
  // Cover Image Upload
  const coverImageMimeType = file.coverImage[0].mimetype.split("/").at(-1);
  const coverImageFileName = file.coverImage[0].filename;
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/storage/books-uploads",
    coverImageFileName
  );
  const coverImageUploadResult = await cloudinary.uploader.upload(
    coverImageFilePath,
    {
      filename_override: coverImageFileName,
      folder: "eblib-api/books/coverImages",
      format: coverImageMimeType,
    }
  );

  try {
    // Book PDF Upload
    const bookPdfFileMimeType = file.pdfFile[0].mimetype.split("/").at(-1);
    const bookPdfFileFileName = file.pdfFile[0].filename;
    const bookPdfFileFilePath = path.resolve(
      __dirname,
      "../../public/storage/books-uploads",
      bookPdfFileFileName
    );
    const bookPdfFileUploadResult = await cloudinary.uploader.upload(
      bookPdfFileFilePath,
      {
        resource_type: "raw",
        filename_override: bookPdfFileFileName,
        folder: "eblib-api/books/bookPdfFiles",
        format: bookPdfFileMimeType,
      }
    );

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title: title,
      author: _req.loginUserID,
      genre: genre,
      coverImage: coverImageUploadResult?.secure_url,
      pdfFile: bookPdfFileUploadResult.secure_url,
    });

    // Delete Files From Local Server
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookPdfFileFilePath);

    res.status(201).json({ _id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, "Error while upload book"));
  }
};

export { createBook };
