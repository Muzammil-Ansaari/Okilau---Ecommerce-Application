import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChatBot = () => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (customMessage) => {
    const userMessage = customMessage || input;
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    try {
      const res = await axiosInstance.post(
        "/chatbot/chat",
        {
          message: userMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data;

      // 🔥 HANDLE DIFFERENT RESPONSE TYPES
      if (data.type === "products") {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            products: data.products,
            title: data.title,
            viewAllLink: data.viewAllLink,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong 😢" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
          >
            <Bot />
          </button>
        )}
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white shadow-xl border flex flex-col z-50 rounded-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <h2 className="text-sm font-semibold">Support Chat</h2>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* QUICK ACTIONS 🔥 */}
          <div className="flex gap-2 p-2 border-b bg-white">
            <button
              onClick={() => handleSend("men")}
              className="text-xs border px-2 py-1 rounded"
            >
              Men
            </button>
            <button
              onClick={() => handleSend("women")}
              className="text-xs border px-2 py-1 rounded"
            >
              Women
            </button>
            <button
              onClick={() => handleSend("kids")}
              className="text-xs border px-2 py-1 rounded"
            >
              Kids
            </button>
            <button
              onClick={() => handleSend("order status")}
              className="text-xs border px-2 py-1 rounded"
            >
              Track Order
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] text-sm ${
                  msg.role === "user" ? "ml-auto text-right" : ""
                }`}
              >
                {/* 🛍️ PRODUCT RESPONSE */}
                {msg.products ? (
                  <div className="bg-gray-200 p-2 rounded-lg text-left">
                    <p className="text-xs font-semibold mb-2">{msg.title}</p>

                    <div className="space-y-2">
                      {msg.products.map((p) => (
                        <Link to={`/products/${p.id}`} key={p.id}>
                          <div className="border p-2 rounded bg-white">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-20 w-full object-cover rounded"
                            />
                            <p className="text-xs mt-1">{p.title}</p>
                            <p className="text-sm font-bold">$ {p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      to={msg.viewAllLink}
                      className="block mt-2 text-center text-xs underline"
                    >
                      View all products →
                    </Link>
                  </div>
                ) : (
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="text-xs text-gray-400 px-2">Bot is typing...</div>
            )}

            <div ref={bottomRef}></div>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-3 py-2 text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              disabled={typing}
              className="bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
