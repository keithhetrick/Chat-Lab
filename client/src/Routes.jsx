import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import Chat from "./Chat";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return <Chat />;
  }

  return <RegisterAndLoginForm />;
};

export default Routes;
