import React from "react";

const FullScreenProcessing = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center gap-5">

      {/* Loading Bar */}
      <div className="w-64 h-2 bg-gray-600/50 rounded-full overflow-hidden">
        <div className="h-full bg-[#646cff] animate-loaderBar"></div>
      </div>

      {/* Text */}
      <span className="text-white text-xl font-medium tracking-wide animate-pulse">
        {message}
      </span>

    </div>
  );
};

export default FullScreenProcessing;
