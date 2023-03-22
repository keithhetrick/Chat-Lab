import { useState } from "react";
import axios from "axios";

const AiMessageForm = () => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // post to axios /api/openai endpoint
    axios.post("/openai", { prompt }).then((res) => {
      setPrompt(res?.data);
      console.log(res?.data);
    });
  };

  return (
    <div className="message-form-container">
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default AiMessageForm;
