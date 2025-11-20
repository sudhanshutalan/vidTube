import express from "express";
import cors from "cors";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import cookieParser from "cookie-parser";

const app = express();

//basic express configuration

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser);

// cors configuration
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

// healthcheck routes
app.use("/api/v1/healthcheck", healthcheckRouter);

export default app;
