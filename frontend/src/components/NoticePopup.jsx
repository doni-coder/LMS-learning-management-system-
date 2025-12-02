import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const NoticePopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("noticeDismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const closePopup = () => {
    setVisible(false);
    localStorage.setItem("noticeDismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl max-w-sm w-[90%] p-5 relative text-center animate-scaleIn">
        
        {/* Close Button */}
        <div
          className="absolute right-4 top-4 text-gray-500 hover:text-black dark:hover:text-white"
          onClick={closePopup}
        >
          <X size={24} />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold dark:text-yellow-500 mb-2">
          Notice 🛠️
        </h2>

        {/* Message */}
        <p className=" dark:text-gray-300 text-sm">
          Our backend is currently deployed on Render's free tier, so responses may take
          a little longer than usual. Thank you for your patience! 😊
        </p>

      </div>
    </div>
  );
};

export default NoticePopup;
