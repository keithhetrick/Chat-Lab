import StandardMessageForm from "./StandardMessageForm";

const AiChat = ({ setIsSelected, isSelected }) => {
  // console.log("AI Message Form: ", isSelected);

  return (
    <div className="border p-2 bg-slate-100 rounded-sm cursor-pointer z-50 shadow-lg space-y-2  h-fit">
      {isSelected ? (
        <StandardMessageForm
          id="ai__chat__message__form"
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
