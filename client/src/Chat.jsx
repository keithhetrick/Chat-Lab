import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./Contact";
import EditUser from "./EditUser";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [editUser, setEditUser] = useState(false);

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

  return (
    <div className="flex h-screen">
      <aside className="bg-[#f6f6f6] w-1/4 sm:w-1/3 flex flex-col">
        <div id="contacts__list" className="flex-grow overflow-auto">
          <Logo />
          <div className="flex-auto text-xs sm:text-base">
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
        <div className="p-2 text-center flex xs:flex-grow xs:overflow-auto items-center justify-center border-t bg-[#fffaf7]">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 sm:"
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
            className="text-sm bg-blue-200 py-1 px-2 text-gray-500 border rounded-md hover:bg-blue-300 transition duration-200"
          >
            logout
          </button>
        </div>
      </aside>

      <section className="flex flex-col bg-blue-50 w-3/4 sm:w-2/3">
        <div className="w-full border bg-slate-100 text-sm text-gray-600 flex justify-end p-2">
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

        <div className="flex-grow px-2 pt-2">
          {!selectedUserId || editUser ? (
            <div className="flex flex-col items-center justify-center h-full relative">
              <div className=" text-gray-400">
                {editUser ? (
                  <EditUser
                    username={username}
                    setUsername={setUsername}
                    setEditUser={setEditUser}
                    setPassword={setPassword}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-gray-400">&larr; Select a person</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative h-full">
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
                          ? "bg-blue-500 text-white"
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
        </div>

        {!!selectedUserId && (
          <form className="flex gap-2 px-2 pb-2" onSubmit={sendMessage}>
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
        )}
      </section>
    </div>
  );
};

export default Chat;
