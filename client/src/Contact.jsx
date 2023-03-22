import React from "react";
import Avatar from "./Avatar";

const Contact = ({ id, username, onClick, selected, online }) => {
  // const countNewMessages = () => {
  //   let count = 0;
  //   for (let i = 0; i < messsages?.length; i++) {
  //     if (messages[i]?.read === false) {
  //       count++;
  //       console.log("Count", count);
  //     }
  //   }
  //   return count;
  // };
  // const newMessage = countNewMessages();

  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        "border-b border-gray-200 flex items-center gap-2 cursor-pointer " +
        (selected ? "bg-blue-50" : "")
      }
    >
      {selected && <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>}
      <div className="flex gap-2 p-2 px-4 w-full items-center justify-between hover:transform hover:scale-105 transition-all duration-100">
        <div className="flex gap-2 items-center">
          <Avatar online={online} username={username} userId={id} />
          <span className="text-gray-800">{username}</span>
        </div>
        {/* {newMessage > 0 && (
          <div className="bg-blue-500 text-white rounded-full px-2 py-1">
            {newMessage}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Contact;
