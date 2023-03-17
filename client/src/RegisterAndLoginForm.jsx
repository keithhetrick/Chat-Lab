import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
// import AnimatedCursor from "react-animated-cursor";

function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLoginOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  };

  const VIDEO_SOURCE = (
    <video
      aria-hidden="true"
      muted
      className="z-10 absolute max-h-screen h-screen w-screen object-cover transition-opacity duration-300 pointer visible opacity-100"
      autoPlay
      loop
      playsInline
    >
      <source
        src="https://res.cloudinary.com/dwn6kesnb/video/upload/v1679028548/samples/landing-page-vids/video_2_oxpjda.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.{" "}
    </video>
  );

  const LABEL_CHARACTERS = "Chat Lab AI".split("");

  return (
    <main id="register__login__form h-screen w-screen items-center m-0 relative">
      {/* <AnimatedCursor /> */}
      <label
        id="landing__page__label"
        className="flex text-center text-6xl mt-1 px-4 justify-between chat__lab__font"
      >
        {LABEL_CHARACTERS.map((char, i) => (
          <span key={i} className="text-black font-extrabold">
            {char}
          </span>
        ))}
      </label>

      <div>{VIDEO_SOURCE}</div>

      <form
        className="z-20 w-fit h-fit bg-slate-100/80 rounded-sm py-10 px-12 m-auto absolute top-0 bottom-0 left-0 right-0 items-center shadow-lg space-y-6"
        onSubmit={handleSubmit}
        action="#"
      >
        <div className="text-center text-2xl font-bold mb-6 chat__lab__font chat__lab__font">
          {isLoginOrRegister === "register" ? "REGISTER" : "LOGIN"}
        </div>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          id="username"
          className="block w-full rounded-sm p-2 mb-2 border chat__lab__font"
          required
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          id="password"
          className="block w-full rounded-sm p-2 mb-2 border chat__lab__font"
          required
        />
        <button className="bg-blue-500 text-white block w-full chat__lab__font rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-4 chat__lab__font">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button
                className="ml-1 text-red-700"
                onClick={() => setIsLoginOrRegister("login")}
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Dont have an account?
              <button
                className="ml-1 text-red-700"
                onClick={() => setIsLoginOrRegister("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}

export default RegisterAndLoginForm;
