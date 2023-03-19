import { useContext } from "react";
import { UserContext } from "./UserContext";

const EditUser = () => {
  const { username, setUsername } = useContext(UserContext);

  console.log("username", username);

  return (
    <div>
      Edit User Page{" "}
      {username ? <div>Logged in as {username}</div> : <div>Not logged in</div>}
    </div>
  );
};

export default EditUser;
