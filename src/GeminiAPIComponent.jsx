import React, { useState } from "react";
import { GEMINI_API_KEY, MODEL } from "../config";

const GeminiAPIComponent = () => {
    const [inputText, setInputText] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_KEY = GEMINI_API_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResponse("");

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: inputText }] }] })
            });

            if (!res.ok) throw new Error("Failed to fetch response from Gemini API.");

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
            setResponse(reply);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to format the response
    const formatResponse = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // Bold text
            .replace(/\*(.*?)\*/g, "<em>$1</em>")              // Italic text
            .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>") // Code blocks
            .replace(/`(.*?)`/g, "<code>$1</code>")           // Inline code
            .replace(/\n/g, "<br/>");                         // New lines
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gemini API Integration</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your query"
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>

            {error && <p className="text-red-500">Error: {error}</p>}

            {response && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-lg font-semibold mb-2">Response:</h2>
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
                    />
                </div>
            )}
        </div>
    );
};

export default GeminiAPIComponent;
