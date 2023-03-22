import StandardMessageForm from "./StandardMessageForm";

const AiChat = ({ setIsSelected, isSelected }) => {
  // console.log("AI Message Form: ", isSelected);

  return (
    <div className="border p-2 bg-slate-400 cursor-pointer z-50">
      {isSelected ? (
        <StandardMessageForm
          setIsSelected={setIsSelected}
          isSelected={isSelected}
        />
      ) : (
        <div>AI Chat</div>
      )}
    </div>
  );
};

export default AiChat;
