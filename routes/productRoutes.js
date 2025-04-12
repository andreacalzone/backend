import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts); // GET alla produkter
router.get("/:id", getProductById); // GET en produkt
router.post("/", createProduct); // POST ny produkt
router.put("/:id", updateProduct); // PUT uppdatera produkt
router.delete("/:id", deleteProduct); // DELETE produkt

export default router;
