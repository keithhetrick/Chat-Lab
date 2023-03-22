import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const EditUser = ({ username, setUsername, setEditUser }) => {
  const { password, setPassword } = useContext(UserContext);

  const [tempUsername, setTempUsername] = useState(username);
  const [tempPassword, setTempPassword] = useState(password || "");

  // ERROR HANDLING
  const [errors, setErrors] = useState(null);

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();

    setUsername(tempUsername);
    setPassword(tempPassword);
    console.table({
      username: tempUsername,
      password: tempPassword,
    });
  };

  const handleClose = () => {
    setErrors(null);
    setEditUser(false);
  };

  return (
    <div
      id="update__user__modal"
      className="z-20 w-fit h-fit border bg-slate-100/90 rounded-sm py-5 px-6 m-auto absolute top-0 right-0 items-center shadow-lg space-y-2"
    >
      <form onSubmit={handleUpdateUserSubmit} action="#">
        <div
          className="text-gray-400 text-right absolute top-1 right-2 animate-pulse hover:animate-bounce cursor-pointer"
          onClick={handleClose}
        >
          &uarr;
        </div>
        <div className="flex items-center mb-1 justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
          <div className="text-center align-middle text-2xl font-bold tracking-wide chat__lab__font chat__lab__font">
            Update {username}
          </div>
        </div>
        {errors && (
          <div className="mb-2 -mt-4">
            <ErrorMessage
              className="text-center"
              variant={errors ? "danger" : "success"}
              message={errors ? errors : "Success"}
            />
          </div>
        )}
        <input
          value={tempUsername || ""}
          onChange={(ev) => setTempUsername(ev.target.value)}
          type="text"
          placeholder="username"
          id="username"
          className="block w-full rounded-sm p-2 tracking-wide mb-2 border chat__lab__font"
          // required
        />
        <input
          value={tempPassword || ""}
          onChange={(ev) => setTempPassword(ev.target.value)}
          type="current-password"
          placeholder="password"
          id="password"
          className="block w-full rounded-sm p-2 mb-2 tracking-wide border chat__lab__font"
          // required
        />
        <button className="bg-blue-500 tracking-wide text-white block w-full chat__lab__font rounded-sm p-2">
          Update
        </button>
        {/* have Cancel button hide the edit window */}
      </form>
      <button
        className="bg-gray-500 tracking-wide text-white block w-full chat__lab__font rounded-sm p-2"
        onClick={handleClose}
      >
        Cancel
      </button>
    </div>
  );
};

export default EditUser;
