import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email och lösenord krävs." });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Användare finns redan." });
      }
  
      const newUser = new User({ email, password }); // 👈 Spara som vanligt
      await newUser.save(); // 👈 Hashet sker automatiskt i modellen
  
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Fel vid registrering", error });
    }
  };
  

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Kontrollera att båda fält är ifyllda
      if (!email || !password) {
        return res.status(400).json({ message: "Email och lösenord krävs" });
      }
  
      // Hitta användaren i databasen
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Felaktig e-post eller lösenord" });
      }
  
      // Jämför lösenordet
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Felaktig e-post eller lösenord" });
      }
  
      // Skapa och skicka token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Något gick fel vid inloggning", error });
    }
  };
