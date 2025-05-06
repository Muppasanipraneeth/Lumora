import { useEffect, useState } from "react";

interface Message {
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

const ChatHistory: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const res= fetch("http://localhost:5000/api/chat/messages");
    console.log("Response:", res);
    res.then((res) => res.json())
      .then((data) => {
        console.log("Data:", data);
        setMessages(data);
      })
    
  }, []);

  return (
    <div className="flex-1 p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      {messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 p-4 rounded-lg max-w-2xl ${
              msg.sender === "user" ? "bg-blue-700 text-white ml-auto" : "bg-gray-800 text-white mr-auto"
            }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;