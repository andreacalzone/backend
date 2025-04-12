import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Alla fält måste vara ifyllda." });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      message,
      user: req.user.userId, // från authMiddleware
    });

    const savedMessage = await newMessage.save();
    res.status(200).json({ message: "Meddelandet sparades!", savedMessage });
  } catch (error) {
    res.status(400).json({ message: "Fel vid sparande av meddelande", error });
  }
};


export const getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const messages = await Message.find({ user: userId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Fel vid hämtning av meddelanden", error });
    }
};