import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database is Conneted");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error in Connecting to Database", err);
    });

    await mongoose.connect(config.mongo_uri as string);
  } catch (err) {
    console.error("Failed to Connect Database..", err);
    process.exit(1);
  }
};

export default connectDB;
