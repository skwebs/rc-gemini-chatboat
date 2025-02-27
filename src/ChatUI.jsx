import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "./config";
import "./chatui.css";
const genAI = new GoogleGenerativeAI(API_KEY);

const ChatUI = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasShadow, setHasShadow] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    document.title = "ChatBot | By SGN Students";
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      setHasShadow(scrollTop > 50);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const questionRef = useRef(null); // Reference for scrolling to user question

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    setError("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputText);
      const reply = result.response.text() || "No response available.";

      const aiMessage = { role: "ai", text: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>") // Code block
      .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
      .replace(/\n/g, "<br/>"); // Line breaks
  };

  return (
    <div className="px-4 md:px-0 bg-overlay flex  justify-center align-center items-center">
      <div className="relative h-[calc(100vh-100px)] md:h-[calc(100vh-50px)] overflow-hidden flex  flex-col w-full max-w-2xl bg-white shadow-lg rounded-2xl">
        <div
          className={`absolute top-0 font-semibold left-0 px-6 flex items-center gap-4  bg-white py-3 w-full ${hasShadow && "shadow"
            }`}
        >
          <h2 className="text-2xl font-bold text-gray-400">ChatBot</h2>
          <span className="text-gray-400 text-xs">
            Created by{" - "}
            <span className=" leading-0 font-normal text-gray-400">
              SGN Student with the help of Computer Teacher
            </span>
          </span>
        </div>

        {/* Chat messages */}
        <div
          className="no-scrollbar overflow-y-auto flex-1 px-6 pt-14 pb-24  rounded "
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={msg.role === "user" ? questionRef : null} // Scroll user question into view
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                } mb-2`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
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
        <div className="absolute bottom-0 left-0 w-full px-3 pb-3 bg-white">
          <form
            onSubmit={handleSubmit}
            className="bg-white flex shadow-lg border border-gray-200 rounded-2xl overflow-hidden pe-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask something..."
              className="flex-grow focus:outline-none  p-6"
            />
            <button type="submit" className="cursor-pointer ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-circle-fill size-10"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
              </svg>
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default ChatUI;
