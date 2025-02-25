import React, { useState } from "react";

import { GEMINI_API_KEY, MODEL } from "../config";


function ChatApp() {
    const [inputText, setInputText] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const API_KEY = "your_openai_api_key_here"; // Replace with your OpenAI API key

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: inputText }],
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch the response.");
            }

            const data = await res.json();
            setResponse(data.choices[0].message.content);
        } catch (error) {
            console.error("Error fetching API response:", error);
            setResponse("Failed to get a response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>ChatGPT API in React</h1>
            
            <textarea
                rows="4"
                cols="50"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question here..."
            />
            <br />

            <button onClick={handleSendMessage} disabled={loading}>
                {loading ? "Loading..." : "Send"}
            </button>

            {response && (
                <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
                    <strong>Response:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
