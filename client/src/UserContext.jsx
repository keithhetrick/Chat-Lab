import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [password, setPassword] = useState(null);

  // get user ID and Username
  useEffect(() => {
    axios.get(`/users/${id}`).then((response) => {
      setId(response?.data?.userId);
      setUsername(response?.data?.username);
      setPassword(response?.data?.user?.password);

      // console.log("\nUSER CONTEXT response", response?.data?.user?.password);
    });
  }, []);

  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response?.data?.userId);
      setUsername(response?.data?.username);

      // console.log("\nUSER CONTEXT response", response);
    });
  }, []);

  console.log("\nUSER CONTEXT", { password });

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, password, setPassword }}
    >
      {children}
    </UserContext.Provider>
  );
};
