import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routes import
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

//routes declaration
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

// http://localhost:8000/api/v1/users/register

export { app };
