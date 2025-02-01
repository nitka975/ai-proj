import React from 'react';
import { useState} from "react"
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Загружаем ключ из .env
  dangerouslyAllowBrowser: true, // Нужен, так как запрос идет из браузера
});

function App() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleRequest = async () => {
    if (!input.trim()) return; // Проверяем, чтобы не отправлять пустые запросы

    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: input }],
      });

      setResponse(completion.choices[0].message.content);
      setInput("");
    } catch (error) {
      console.error("Ошибка запроса:", error);
      setResponse("Ошибка запроса. Проверь API-ключ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Чат с OpenAI</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите сообщение..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleRequest} disabled={loading}>
        {loading ? "Генерация..." : "Отправить"}
      </button>
      <p><strong>Ответ:</strong> {response || "Ожидается ввод..."}</p>
    </div>
  );
}
export default App;