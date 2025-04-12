// src/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js'; // För att hämta produktinformation
import jwt from 'jsonwebtoken';

export const createOrder = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Ingen autentiseringstoken hittades.' });
  }

  try {
    // Verifiera token och få användarens ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Ordern måste innehålla produkter.' });
    }

    // Hämta detaljer om produkterna från databasen
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produkt med id ${item.productId} hittades inte.` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Skapa och spara ordern i databasen
    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Fel vid skapande av order', error });
  }
};

export const getOrders = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Ingen autentiseringstoken hittades.' });
  }

  try {
    // Verifiera token och få användarens ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Hämta alla ordrar för användaren med produktinformation
    const orders = await Order.find({ user: userId })
      .populate('products.productId', 'name price description') // Här populär vi produktinformation
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fel vid hämtning av orderhistorik', error });
  }
};
