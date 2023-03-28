import { useEffect, useState } from "react";
import axios from "axios";

function findHighestValue(arr) {
  let highestValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > highestValue) {
      highestValue = arr[i];
    }
  }
  return highestValue;
}

const AiMessageForm = () => {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState({});
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [storeAiResponse, setStoreAiResponse] = useState({});
  const [storePrompt, setStorePrompt] = useState("");

  //store response in localStorage to allow for reloading of page
  useEffect(() => {
    const storedAiResponse = localStorage.getItem("aiResponse");
    const storedPrompt = localStorage.getItem("prompt");
    if (storedAiResponse) {
      setAiResponse(JSON.parse(storedAiResponse));
    }
    if (storedPrompt) {
      setPrompt(JSON.parse(storedPrompt));
    }
  }, [storeAiResponse, storePrompt]);

  const handlePromptSubmit = (e) => {
    e.preventDefault();

    axios.post("/openai", { prompt }).then((res) => {
      setAiResponse(res.data);
      console.log(res.data);

      displayPrompt
        ? setDisplayPrompt(displayPrompt + prompt)
        : setDisplayPrompt(prompt);

      // // store response in localStorage
      // localStorage.setItem("aiResponse", JSON.stringify(res.data));
      // localStorage.setItem("prompt", JSON.stringify(prompt));

      // // store response in state
      // setStoreAiResponse(res.data);
      // setStorePrompt(prompt);

      // Clear the prompt
      setPrompt("");
    });
  };

  const aiResponseChoices = aiResponse?.data?.response || false;

  // format code from response so that it mirrors the exact response from AI
  const formatCode = (code) => {
    if (code) {
      const formattedCode = code
        .replace(/\\n/g, "\n\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\f/g, "\f")
        .replace(/\\b/g, "\b")
        .replace(/\\v/g, "\v")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      return formattedCode;
    } else {
      return false;
    }
  };

  // console.log(
  //   "\nStore Prompt: ",
  //   storePrompt,
  //   "\nStore Ai Response: ",
  //   storeAiResponse
  // );

  return (
    <form
      className="flex flex-col gap-6 p-3 items-center h-fit"
      id="ai__chat__message__form"
      onSubmit={handlePromptSubmit}
    >
      <label>
        <h3 className="text-gray-800 text-base">Prompt</h3>
      </label>
      <input
        className="w-full h-[40px] rounded-sm border border-gray-300 px-4 py-2 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Type a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {aiResponse ? (
        <div className="flex flex-col gap-2 p-3 items-center h-fit">
          {displayPrompt ? (
            <p className="text-gray-800 text-sm">
              <strong>Prompt: </strong>
              {displayPrompt}
            </p>
          ) : (
            false
          )}
          <label>
            <h3 className="text-gray-800 text-base">Response</h3>
          </label>
          <pre className="text-gray-800 text-sm">
            {formatCode(aiResponseChoices)}
          </pre>
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
