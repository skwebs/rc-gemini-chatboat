import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { GEMINI_API_KEY, MODEL } from "../config";

const ChatBoat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const handleSend = async () => {
    console.log(input);
    if (!input.trim()) return;
    // const newMessages = [...messages, { text: input, isUser: true }];
    // setMessages(newMessages);
    // setInput("");
    try {
      const model = genAI.getGenerativeModel({ model: MODEL });

      // const prompt = "Explain how AI works";

      const result = await model.generateContent(input);
      console.log(result.response.text());

      const newMessages = [
        ...messages,
        { text: result.response.text(), isUser: false },
      ];
      setMessages(newMessages);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          className="border-2 border-gray-300 p-2"
          autoComplete="off"
          autoFocus={true}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <br />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
        <div>
          {messages.map((message, index) => (
            <div key={index} className={message.isUser ? "user" : "bot"}>
              {message.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatBoat;
