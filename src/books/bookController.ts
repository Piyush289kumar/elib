import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import * as fs from "node:fs";
import { AuthRequest } from "../middlewares/authentication";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  try {
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    const getBookById = await bookModel.findOne({ _id: bookId });
    if (!getBookById) {
      return next(createHttpError(404, "Book is Not Found."));
    }

    // Check Access
    const _req = req as AuthRequest;
    if (getBookById.author.toString() !== _req.loginUserID) {
      return next(createHttpError(403, "You Can't Update Others Book."));
    }

    const file = req.files as { [filename: string]: Express.Multer.File[] };

    let coverImageUploadResult;
    if (file?.coverImage && file.coverImage.length > 0) {
      // Cover Image Upload
      const coverImageFileName = file.coverImage[0].filename;
      const coverImageMimeType = file.coverImage[0].mimetype.split("/").at(-1);
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
      await fs.promises.unlink(coverImageFilePath);
    }

    let bookPdfFileUploadResult;
    if (file?.pdfFile && file.pdfFile.length > 0) {
      // Book PDF Upload
      const bookPdfFileFileName = file.pdfFile[0].filename;
      const bookPdfFileMimeType = file.pdfFile[0].mimetype.split("/").at(-1);
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
      await fs.promises.unlink(bookPdfFileFilePath);
    }
    const updateBook = await bookModel.findByIdAndUpdate(
      bookId,
      {
        title: title,
        genre: genre,
        coverImage: coverImageUploadResult
          ? coverImageUploadResult.secure_url
          : getBookById.coverImage,
        pdfFile: bookPdfFileUploadResult
          ? bookPdfFileUploadResult.secure_url
          : getBookById.pdfFile,
      },
      { new: true }
    );

    res.status(200).json({ updateBook });
  } catch (error) {
    return next(createHttpError(500, "Error while updating book."));
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default page is 1
    const limit = parseInt(req.query.limit as string) || 5; // Default limit is 5
    const skip = (page - 1) * limit;

    const books = await bookModel.find().skip(skip).limit(limit);
    const totalBooks = await bookModel.countDocuments();

    res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    return next(createHttpError(500, "Error While Fetching All Books."));
  }
};

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    res.status(200).json({
      book,
    });
  } catch (error) {
    return next(createHttpError(500, "Error While Fetching Book By Id."));
  }
};

export { createBook, updateBook, getAllBooks, getBookById };
