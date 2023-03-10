const Avatar = ({ username, userId }) => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-teal-200",
    "bg-indigo-200",
    "bg-gray-200",
    "bg-orange-200",
    "bg-cyan-200",
    "bg-emerald-200",
    "bg-rose-200",
    "bg-fuchsia-200",
    "bg-lime-200",
    "bg-violet-200",
    "bg-sky-200",
    "bg-amber-200",
    "bg-cool-gray-200",
    "bg-warm-gray-200",
    "bg-true-gray-200",
    "bg-blue-gray-200",
    "bg-light-blue-200",
    "bg-light-green-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={"w-8 h-8 relative rounded-full flex items-center " + color}>
      <div className="text-center w-full opacity-70">{username[0]}</div>
    </div>
  );
};

export default Avatar;
