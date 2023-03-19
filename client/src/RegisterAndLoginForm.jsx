import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
// import AnimatedCursor from "react-animated-cursor";

function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
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
      className="z-10 absolute max-h-screen h-screen w-screen object-cover transition-opacity duration-300 pointer visible opacity-100 "
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

  // isMobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 840 || window.innerHeight < 600) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const DESKTOP_FORM = (
    <form
      className="z-20 w-fit h-fit bg-slate-100/90 rounded-sm py-10 px-12 m-auto absolute top-0 bottom-0 left-0 right-0 items-center shadow-lg space-y-6"
      onSubmit={handleSubmit}
      action="#"
    >
      <div className="flex items-center mb-6 justify-center gap-2">
        {/* <img src={LOGO} alt="logo" className="w-12 h-12" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
        </svg>
        <div className="text-center text-2xl font-bold tracking-wide chat__lab__font chat__lab__font">
          {isLoginOrRegister === "register" ? "REGISTER" : "LOGIN"}
        </div>
      </div>
      <input
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        type="text"
        placeholder="username"
        id="username"
        className="block w-full rounded-sm p-2 tracking-wide mb-2 border chat__lab__font"
        required
      />
      <input
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        type="password"
        placeholder="password"
        id="password"
        className="block w-full rounded-sm p-2 mb-2 tracking-wide border chat__lab__font"
        required
      />
      <button className="bg-blue-500 tracking-wide text-white block w-full chat__lab__font rounded-sm p-2">
        {isLoginOrRegister === "register" ? "Register" : "Login"}
      </button>
      <div className="text-center mt-4 chat__lab__font">
        {isLoginOrRegister === "register" && (
          <div>
            Already a member?
            <button
              className="ml-1 text-[#ff5c0f] hover:text-[#df0606]"
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
              className="ml-1 text-[#ff5c0f] hover:text-[#df0606]"
              onClick={() => setIsLoginOrRegister("register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </form>
  );

  const MOBILE_FORM = (
    <form
      className="z-20 w-fit h-fit bg-slate-100/90 rounded-sm py-6 px-8 m-auto absolute top-8 bottom-0 left-0 right-0 items-center shadow-lg"
      onSubmit={handleSubmit}
      action="#"
    >
      <div className="flex items-center mb-6 justify-center gap-6">
        {/* <img src={LOGO} alt="logo" className="w-12 h-12" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
        </svg>
        <div className="text-center text-2xl font-bold tracking-wide chat__lab__font chat__lab__font">
          {isLoginOrRegister === "register" ? "REGISTER" : "LOGIN"}
        </div>
      </div>
      <input
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        type="text"
        placeholder="username"
        id="username"
        className="block w-full rounded-sm p-2 tracking-wide mb-2 border chat__lab__font"
        required
      />
      <input
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        type="password"
        placeholder="password"
        id="password"
        className="block w-full rounded-sm p-2 mb-2 tracking-wide border chat__lab__font"
        required
      />
      <button className="bg-blue-500 tracking-wide text-white block w-full chat__lab__font rounded-sm p-2">
        {isLoginOrRegister === "register" ? "Register" : "Login"}
      </button>
      <div className="text-center mt-4 chat__lab__font">
        {isLoginOrRegister === "register" && (
          <div>
            Already a member?
            <button
              className="ml-1 text-[#ff5c0f] hover:text-[#df0606]"
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
              className="ml-1 text-[#ff5c0f] hover:text-[#df0606]"
              onClick={() => setIsLoginOrRegister("register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </form>
  );

  return (
    <main
      id="register__login__form"
      className="h-screen w-screen items-center m-0 relative"
    >
      {/* <AnimatedCursor /> */}
      <label
        id="landing__page__label"
        className="flex z-30 absolute top-0 left-0 right-0 text-center text-6xl sm:px-4 px-2 pt-1 justify-between bg-[#ffe8d7]/50 bg-blur-md chat__lab__font"
      >
        {LABEL_CHARACTERS.map((char, i) => (
          <span key={i} className="text-black font-extrabold">
            {char}
          </span>
        ))}
      </label>

      <div>{VIDEO_SOURCE}</div>

      {isMobile ? (
        <div className="z-40 ">{MOBILE_FORM}</div>
      ) : (
        <div className="z-40">{DESKTOP_FORM}</div>
      )}
    </main>
  );
}

export default RegisterAndLoginForm;
