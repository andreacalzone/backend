import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Något gick fel", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produkten hittades inte" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Fel vid hämtning av produkt", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Fel vid skapande av produkt", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedProduct) return res.status(404).json({ message: "Produkten hittades inte" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Fel vid uppdatering av produkt", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Produkten hittades inte" });
    res.json({ message: "Produkten togs bort" });
  } catch (error) {
    res.status(500).json({ message: "Fel vid borttagning av produkt", error });
  }
};
