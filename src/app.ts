import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRoutes";

const app = express();
app.use(express.json());

// Rotues

// Https Method -> GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Server is Running.." });
});

app.use("/api/users", userRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
