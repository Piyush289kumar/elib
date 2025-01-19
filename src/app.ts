import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRoutes";
import bookRouter from "./books/bookRoutes";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.frontend_domain,
  })
);

// Rotues

// Https Method -> GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Server is Running.." });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
