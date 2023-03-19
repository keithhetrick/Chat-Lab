import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response?.data?.userId);
      setUsername(response?.data?.username);
      setPassword(response?.data?.password);

      console.log("response", response);
    });
  }, []);

  // console.log("Password", password);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
