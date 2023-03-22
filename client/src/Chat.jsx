import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./Contact";
import EditUser from "./EditUser";
import AiChat from "./AI_Chat";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [editUser, setEditUser] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleAiChannelSelect = () => {
    setIsSelected(!isSelected);
  };

  const divUnderMessages = useRef();

  const { username, id, setId, setUsername } = useContext(UserContext);

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnect, trying to reconnect...");
        connectToWs();
      }, 1000);
    });
  };

  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);

    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
      // console.log("\nMessages", messageData);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }

    // console.log("MessageData", messageData);
  };

  const sendMessage = (e, file = null) => {
    if (e) {
      e.preventDefault();
    }

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );

    if (file) {
      axios.get(`/messages/${selectedUserId}`).then((res) => {
        setMessages(res?.data);
        console.table(res?.data);
      });
    } else {
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  const sendFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target?.files?.[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  // make an alert that triggers whenever a new message is sent
  const alert = (message) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  };

  useEffect(() => {
    const div = divUnderMessages?.current;

    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArray = res?.data
        .filter((person) => person?._id !== id)
        .filter((person) => !Object.keys(onlinePeople).includes(person?._id));
      const offlinePeople = {};
      offlinePeopleArray.forEach((p) => {
        offlinePeople[p._id] = p.username;
      });

      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get(`/messages/${selectedUserId}`).then((res) => {
        setMessages(res?.data);
        // console.log("res?.data", res?.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExcludingOurUser = { ...onlinePeople };
  delete onlinePeopleExcludingOurUser[id];

  const messagesWithDuplicates = uniqBy(messages, "_id");

  // console.log("\nMessagesWithDuplicates", messagesWithDuplicates);

  const handleEdit = () => {
    setEditUser((prev) => !prev);
  };

  // if isSelected is true, reset selectedUserId to null to avoid showing the chat window – same for reverse case. useRef to make cleaner/smoother experience
  // useEffect(() => {
  //   if (isSelected) {
  //     setSelectedUserId(null);
  //   }

  //   if (selectedUserId) {
  //     setIsSelected(false);
  //   }
  // }, [isSelected, selectedUserId]);

  // set a timer that loops through 3 🚀🚀🚀 emojis and then resets to 1 🚀 emoji
  const [emoji, setEmoji] = useState("🚀");

  useEffect(() => {
    const timer = setInterval(() => {
      if (emoji === "🚀") {
        setEmoji("🚀🚀");
      } else if (emoji === "🚀🚀") {
        setEmoji("🚀🚀🚀");
      } else if (emoji === "🚀🚀🚀") {
        setEmoji("🚀🚀🚀🚀");
      } else if (emoji === "🚀🚀🚀🚀") {
        setEmoji("🚀🚀🚀🚀🚀");
      } else if (emoji === "🚀🚀🚀🚀🚀") {
        setEmoji("🚀");
      }
    }, 500);

    return () => clearInterval(timer);
  }, [emoji]);

  return (
    <div id="window__section" className="flex h-screen">
      <aside
        id="sidebar__section"
        className="bg-[#f6f6f6] w-1/4 sm:w-1/3 flex flex-col"
      >
        <div
          id="sidebar__contacts__section"
          className="flex-grow overflow-auto relative"
        >
          <Logo />
          <button
            className={
              "border-b border-gray-200 flex items-center cursor-pointer transition w-full " +
              (isSelected ? "text-red-500" : "text-gray-500")
            }
            onClick={handleAiChannelSelect}
          >
            {isSelected && (
              <div className="w-1 bg-red-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex p-3 px-6 w-full items-center justify-between hover:transform hover:scale-105 transition-all duration-100">
              <div className="flex items-center">
                AI Chat {isSelected ? `Running ${emoji}` : "Activate"}
              </div>
            </div>
          </button>
          <div id="contacts__list" className="flex-auto text-xs sm:text-base">
            {Object.keys(onlinePeopleExcludingOurUser).map((userId) => (
              <Contact
                key={userId}
                id={userId}
                online={true}
                username={onlinePeopleExcludingOurUser[userId]}
                onClick={() => setSelectedUserId(userId)}
                selected={userId === selectedUserId}
              />
            ))}
            {Object.keys(offlinePeople).map((userId) => (
              <Contact
                key={userId}
                id={userId}
                online={false}
                username={offlinePeople[userId]}
                onClick={() => setSelectedUserId(userId)}
                selected={userId === selectedUserId}
              />
            ))}
          </div>
        </div>
        <div
          id="sideber__footer__section"
          className="p-[10px] text-center flex xs:flex-grow xs:overflow-auto items-center justify-center border-t bg-[#ffe8d7]"
          // bg-[#fffaf7]
        >
          <span className="mr-2 text-sm text-gray-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
            {username}
          </span>
          <button
            onClick={logout}
            className="bg-blue-500 tracking-wide text-white text-sm block w-fit max-h-fit chat__lab__font rounded-sm py-2 px-4 hover:bg-blue-600 transition duration-200"
          >
            logout
          </button>
        </div>
      </aside>

      <section
        id="messages__section"
        className="flex flex-col bg-blue-50 w-3/4 sm:w-2/3"
      >
        <div
          id="user__header"
          className="w-full border bg-slate-100 text-sm text-gray-600 flex justify-end p-2"
        >
          {username}

          <div
            className="ml-auto flex items-center cursor-pointer"
            onClick={handleEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 1a9 9 0 110 18 9 9 0 010-18zm0 9a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm0-5a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <main id="chat__window" className="flex-grow px-2 pt-2">
          {!selectedUserId || editUser ? (
            <div
              className="flex flex-col items-center justify-center h-full relative"
              id="update__user__modal__hidden"
            >
              <div className=" text-gray-400">
                {editUser ? (
                  <EditUser
                    username={username}
                    setUsername={setUsername}
                    setEditUser={setEditUser}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-gray-400">
                      <span className="animate-pulse hover:animate-bounce cursor-pointer mr-2">
                        &larr;
                      </span>
                      Select a person
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {/* {editUser && !selectedUserId ? (
                <EditUser
                  username={username}
                  setUsername={setUsername}
                  setEditUser={setEditUser}
                />
              ) : null} */}

              {isSelected ? (
                <div className="flex flex-col justify-center h-fit w-full absolute top-0 bottom-0 left-0 right-0 m-auto z-10">
                  <div className="text-gray-400">
                    <AiChat
                      setIsSelected={setIsSelected}
                      isSelected={isSelected}
                    />
                  </div>
                </div>
              ) : null}

              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithDuplicates.map((message) => (
                  <div
                    key={message?._id}
                    className={
                      message?.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-md text-sm " +
                        (message?.sender === id
                          ? "bg-blue-500 text-white" // this is our user text
                          : "bg-white text-gray-800")
                      }
                    >
                      {message?.text}
                      {message?.file && (
                        <div>
                          <a
                            className="uborder-b flex items-center gap-1"
                            href={
                              axios.defaults.baseURL +
                              "/uploads/" +
                              message?.file
                            }
                            target="_blank"
                            download={message?.file?.name}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                              />
                            </svg>
                            {message?.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </main>

        {!!selectedUserId && (
          // <div className="flex flex-col h-full relative">
          //   {editUser ? (
          //     <div className="flex-grow px-2 pt-2">
          //       <div>
          //         <EditUser
          //           username={username}
          //           setUsername={setUsername}
          //           setEditUser={setEditUser}
          //         />
          //       </div>
          //     </div>
          //   ) : null}
          <form
            id="chat__message__form"
            className="flex gap-2 px-2 pb-2 overflow-auto"
            // className="flex absolute bottom-0 w-full gap-2 px-2 pb-2"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <label
              type="button"
              className="bg-blue-200 p-2 text-gray-600 rounded-sm border border-blue-200 cursor-pointer"
            >
              <input type="file" className="hidden" onChange={sendFile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
          // </div>
        )}
      </section>
    </div>
  );
};

export default Chat;
