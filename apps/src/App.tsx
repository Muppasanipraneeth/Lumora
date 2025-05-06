import { Link, Route, Routes } from "react-router-dom";
import ChatHistory from "./components/ChatHistory";
import ChatWindow from "./components/ChatWindow";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar /> 

      <div className="flex flex-1">
       
        <div className="w-64 bg-gray-950 text-white flex flex-col p-4 border-r border-gray-800">
          <nav className="flex-1">
            <Link
              to="/chat"
              className="block p-2 mb-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              New Chat
            </Link>
            <Link
              to="/history"
              className="block p-2 mb-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Chat History
            </Link>
            
          </nav>
          <div className="mt-auto">
            <button className="w-full p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-black">
          <Routes>
            <Route path="/" element={<div className="p-6">Home</div>} />
            <Route path="/about" element={<div className="p-6">About</div>} />
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/history" element={<ChatHistory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}