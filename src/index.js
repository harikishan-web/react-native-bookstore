import express from "express";
import cors from "cors";
import "dotenv/config";
const app = express();
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log("Server is running at PORT ", PORT);
  connectDB();
});
