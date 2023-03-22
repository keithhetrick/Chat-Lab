import { useState } from "react";
import axios from "axios";

const AiMessageForm = () => {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("/openai", { prompt }).then((res) => {
      const { data } = res;

      setAiResponse({ ...data?.data?.response });
      console.log(data);
      console.log("Prompt: ", aiResponse);
    });
  };

  return (
    <form
      className="flex flex-col gap-6 p-3 items-center h-fit"
      id="ai__chat__message__form"
      onSubmit={handleSubmit}
    >
      <label>
        <h3 className="text-gray-800 text-sm">Prompt</h3>
      </label>
      <input
        className="w-full"
        type="text"
        placeholder="Type a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {aiResponse ? (
        <div>
          <label>
            <h3 className="text-gray-800 text-sm">Response</h3>
          </label>
          <p>
            <span className="text-gray-800">
              {aiResponse?.choices?.[0]?.text}
            </span>
          </p>
        </div>
      ) : (
        false
      )}

      <button
        type="submit"
        className="bg-blue-500 tracking-wide text-white text-sm block w-fit max-h-fit chat__lab__font rounded-sm py-2 px-6 hover:bg-blue-600 transition duration-200"
      >
        Send
      </button>
    </form>
  );
};

export default AiMessageForm;
