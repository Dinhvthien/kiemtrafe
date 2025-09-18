const Notification = ({ show, message, type = "info" }) => {
  const getNotificationStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {show && (
        <div
          className={`p-4 rounded-lg shadow-lg ${getNotificationStyle(type)} transition-opacity duration-300`}
        >
          <p className="text-sm sm:text-base">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Notification;