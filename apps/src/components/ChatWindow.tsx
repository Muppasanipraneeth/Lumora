import { FormEvent, useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";

interface Message {
  text: string;
  sender: "user" | "ai";
  timestamp?: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    fetch("http://localhost:5000/api/chat/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    newSocket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && socket) {
      const userMessage = { text: input, sender: "user" };
      socket.emit("sendMessage", userMessage);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">Start a conversation!</div>
        ) : (
          messages.map((msg, idx) => {
            const parts = msg.text.split(/\*\*(.*?)\*\*/g).filter(Boolean);

            return (
              <div
                key={idx}
                className={`mb-4 p-4 rounded-lg max-w-2xl whitespace-pre-wrap ${
                  msg.sender === "user" ? "bg-blue-700 text-white ml-auto" : "bg-gray-800 text-white mr-auto"
                }`}
              >
                {parts.map((part, i) =>
                  i % 2 === 1 ? (
                    <div key={i} className="font-bold text-blue-300 mb-1">{part}</div>
                  ) : (
                    <div key={i} className="mb-2">{part.trim()}</div>
                  )
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white placeholder-gray-400"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-700 text-white rounded-r-lg hover:bg-blue-800 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
