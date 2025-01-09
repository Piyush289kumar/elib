import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true, // Removes unnecessary spaces
      minlength: [2, "Book title must be at least 2 characters long"],
      maxlength: [255, "Book title cannot exceed 255 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Author name is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      // enum: {
      //   values: [
      //     "Fiction",
      //     "Non-Fiction",
      //     "Mystery",
      //     "Fantasy",
      //     "Science",
      //     "Biography",
      //     "History",
      //     "Romance",
      //   ],
      //   message: "{VALUE} is not a valid genre",
      // },
    },
    // publishedYear: {
    //   type: Number,
    //   min: [1450, "Published year cannot be earlier than 1450"],
    //   max: [new Date().getFullYear(), "Published year cannot be in the future"],
    //   required: [true, "Published year is required"],
    // },
    // ISBN: {
    //   type: String,
    //   unique: true,
    //   required: [true, "ISBN is required"],
    //   validate: {
    //     validator: function (value) {
    //       return /^[0-9]{10}|[0-9]{13}$/.test(value); // ISBN-10 or ISBN-13 validation
    //     },
    //     message: "Invalid ISBN format",
    //   },
    // },
    // price: {
    //   type: Number,
    //   required: [true, "Price is required"],
    //   min: [0, "Price cannot be negative"],
    // },
    // stock: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "Stock cannot be negative"],
    // },
    // description: {
    //   type: String,
    //   maxlength: [1000, "Description cannot exceed 1000 characters"],
    //   trim: true,
    // },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    pdfFile: {
      type: String,
      required: [true, "PDF file URL is required"],
    },
  },

  { timestamps: true }
);

export default mongoose.model("Book", BookSchema);
