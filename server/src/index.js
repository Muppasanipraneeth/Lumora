const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chatRoutes = require("../routes/chatRoutes");
const Message = require("../models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use("/api/chat", chatRoutes);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 socket.on("sendMessage", async (data) => {
  const { text, sender } = data;
  console.log("Received:", text);

 
  const message = new Message({ text, sender });
  await message.save();
  io.emit("receiveMessage", message);

  try {
   
    const response = await fetch("https://lumora-deployment-miniproj.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: text,
        Relevent_context: "" 
      }),
    });

    const result = await response.json();
    console.log(result);
    
    const aiText = result.response || "AI didn't respond properly";

   
    const aiMessage = new Message({ text: aiText, sender: "ai" });
    await aiMessage.save();
    io.emit("receiveMessage", aiMessage);

  } catch (err) {
    console.error("Error calling AI API:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// https://lumora-deployment-miniproj.onrender.com/ask this is llm api and 
/**
 * {
  "query": "what is fourier transform",
  "Relevent_context": ""
}
 */