import express from "express";
import cors from "cors";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();

//basic express configuration

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

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
