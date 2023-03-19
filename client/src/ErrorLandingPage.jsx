import React from "react";

const ErrorLandingPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-9xl font-bold">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ErrorLandingPage;
