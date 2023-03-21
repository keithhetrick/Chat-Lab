const useErrorMessage = ({ variant, message }) => {
  // console.log("variant:", variant);
  // console.log("message:", message);

  // add a line break after each comment
  const formattedMessage = message?.split(/,|-/).map((msg, i) => (
    <span key={i}>
      {msg}
      <br />
    </span>
  ));

  return (
    <div
      className="block bg-red-100 w-auto place-content-center text-center border-red-400 text-red-700 px-4 py-3 rounded relative mt-5 mb-5 text-sm"
      variant={variant}
    >
      <span className="block sm:inline">
        <span>{formattedMessage}</span>
      </span>
    </div>
  );
};

export default useErrorMessage;
