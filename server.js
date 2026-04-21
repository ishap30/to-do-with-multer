import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import connectDB from "./src/config/db.js";
import todoRoutes from "./src/routes/todoRoutes.js";

dotenv.config();
connectDB();

// ✅ Auto-create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();

// ✅ Fixed CORS origin — matches React dev server port 3001
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/todos", todoRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Personal Todo API is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});