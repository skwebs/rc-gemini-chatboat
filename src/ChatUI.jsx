import React, { useState, useEffect, useRef } from "react";
// import { API_KEY, API_LINK } from "./config";

const ChatUI = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastMessageRef = useRef(null); // Reference for the latest message


  // Scroll the last message into view with "start" alignment (top of viewport)
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: "user", text: inputText };
    setMessages([...messages, userMessage]);
    setInputText("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_LINK}${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: inputText }] }] })
      });

      if (!res.ok) throw new Error("Failed to fetch the response from Gemini API.");

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";

      const aiMessage = { role: "ai", text: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format the response for display
  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>")              // Italic
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>") // Code block
      .replace(/`(.*?)`/g, "<code>$1</code>")           // Inline code
      .replace(/\n/g, "<br/>");                         // Line breaks
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">SGN ChatBoat</h1>

        {/* Chat messages */}
        <div className="chat-box overflow-y-auto h-96 p-2 border rounded mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                dangerouslySetInnerHTML={{ __html: formatResponse(msg.text) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-gray-200">Typing...</div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask something..."
            className="flex-grow p-2 border rounded-l"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
            Send
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default ChatUI;
