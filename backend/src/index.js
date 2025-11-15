import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello world");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("databse not connected(promise)", error);
    process.exit(1);
  });
