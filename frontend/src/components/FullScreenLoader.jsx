import React from 'react';

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className="w-24 h-24 border-4 border-transparent border-t-[#646cff] border-r-[#646cff] animate-spin rounded-full"></div>
        
        {/* Inner Circle Glow */}
        <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-[#646cff] to-[#33e0ff] blur-md opacity-70 animate-ping"></div>
      </div>

      {/* Loading Text */}
      <p className="absolute bottom-20 text-white text-lg font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default FullScreenLoader;
