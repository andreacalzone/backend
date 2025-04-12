import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from './routes/orderRoutes.js';





dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "API:n fungerar och är kopplad till databasen!" });
});

app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på port ${PORT}`);
});
