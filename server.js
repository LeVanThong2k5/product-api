
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// API kiểm tra tình trạng ứng dụng
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Product API is running"
  });
});

// Đăng ký các API Product
app.use("/api/products", productRoutes);

// Xử lý endpoint không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found"
  });
});

// Kết nối MongoDB trước khi chạy server
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();