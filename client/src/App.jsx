import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";
import axios from "axios";

const App = () => {
  axios.defaults.baseURL = "http://localhost:8000/api";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes
      // className="max-w-screen-sm w-screen"
      />
    </UserContextProvider>
  );
};

export default App;
