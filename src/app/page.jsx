"use client";
import React from "react";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const Page = () => {
  console.log(process.env.OPENAI_API_KEY);

  const [inputValue, setInputValue] = React.useState("");
  const [chatLog, setChatLog] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChatLog((prev) => [...prev, { type: "user", message: inputValue }]);
    setInputValue("");
    sendMessage(inputValue);
  };

  const sendMessage = async (message) => {
    try {
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const data = {
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      };
      setLoading(true);
      const response = await axios.post(url, data, { headers });
      setChatLog((prev) => [
        ...prev,
        { type: "bot", message: response.data.choices[0].message.content },
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <h1>Chat</h1>
      {chatLog.map((message, index) => (
        <div key={index}>
          {message.type === "user" ? "You: " : "Bot: "}
          {message.message}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default Page;
