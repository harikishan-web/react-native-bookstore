import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";
const app = express();
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 3001;

// job.start();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");

  res.json({
    success: true,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log("Server is running at PORT ", PORT);
  connectDB();
});
