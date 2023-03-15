import { useEffect, useState } from "react";

const Logo = () => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode"))
  );

  // toggle dark mode
  const toggleDarkMode = () => {
    if (!darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      setDarkMode(true);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      setDarkMode(false);
    }

    // set local storage to true
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));

    if (!localStorage.getItem("darkMode")) {
      setDarkMode(false);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    if (!localStorage.getItem("darkMode")) {
      setDarkMode(false);
    }
  }, [darkMode]);

  return (
    <div className="text-blue-600 font-bold flex gap-2 p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>
      Chat Lab
      <button
        type="button"
        className="focus:outline-none"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800 dark:text-gray-400 animate-pulse active:animate-ping hover:text-gray-500 rounded-full transition  ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707M18.364 6.364l-.707.707M6.343 18.343l-.707.707"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800 dark:text-gray-300 animate-pulse active:animate-ping hover:text-gray-500 rounded-full transition ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707M18.364 6.364l-.707.707M6.343 18.343l-.707.707"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Logo;
