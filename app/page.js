"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      setMessages([
        ...newMessages,
        { sender: "bot", text: response.data.response },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, I couldn't reach the server." },
      ]);
    }

    setInput("");
  };

  return (
    <div className={`chat-container ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <style jsx>{`
        .chat-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--background);
          color: var(--text);
          transition: background 0.3s, color 0.3s;
        }

        .header {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding: 10px;
          background: var(--header-background);
        }

        .header button {
          background: var(--button-background);
          border: none;
          color: var(--button-text);
          padding: 10px 20px;
          margin: 0 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }

        .header button:hover {
          background: var(--button-hover-background);
        }

        .chat-history {
          flex: 1;
          width: 70%;
          max-height: calc(100% - 80px);
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .message {
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 5px;
          max-width: 80%;
          word-wrap: break-word;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .message.user {
          background-color: var(--user-background);
          align-self: flex-start;
          margin-right: auto;
          margin-left: 10px;
        }

        .message.bot {
          background-color: var(--bot-background);
          align-self: flex-end;
          margin-left: auto;
          margin-right: 10px;
        }

        .input-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 10px;
          background: var(--footer-background);
        }

        .input-container input {
          width: 70%;
          padding: 10px;
          margin-right: 10px;
          border: 1px solid var(--input-border);
          border-radius: 5px;
        }

        .input-container button {
          padding: 10px 20px;
          border: none;
          background: var(--button-background);
          color: var(--button-text);
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }

        .input-container button:hover {
          background: var(--button-hover-background);
        }

        .light {
          --background: #f9f9f9;
          --text: #000;
          --header-background: #ddd;
          --user-background: #daf8cb;
          --bot-background: #f1f0f0;
          --footer-background: #ddd;
          --input-border: #bbb;
          --button-background: #007bff;
          --button-text: #fff;
          --button-hover-background: #0056b3;
        }

        .dark {
          --background: #333;
          --text: #fff;
          --header-background: #444;
          --user-background: #555;
          --bot-background: #666;
          --footer-background: #444;
          --input-border: #555;
          --button-background: #007bff;
          --button-text: #fff;
          --button-hover-background: #0056b3;
        }
      `}</style>
    </div>
  );
}
