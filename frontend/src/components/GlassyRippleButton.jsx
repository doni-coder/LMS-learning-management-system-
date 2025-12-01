import React from "react";

function GlassyRippleButton() {
  return (
    <div className="flex items-center justify-center z-0">
      <div className="relative flex items-center justify-center">
        {/* Ripple circles */}
        <span className="absolute w-10 h-10 rounded-full bg-white/10 backdrop-blur-md animate-ping"></span>
        <span className="absolute w-20 h-20 rounded-full bg-white/5 backdrop-blur-md animate-ping animation-delay-200"></span>
        <span className="absolute w-30 h-30 rounded-full bg-white/5 backdrop-blur-md animate-ping animation-delay-400"></span>

        {/* Button */}
        <button style={{fontSize:'13px'}} className="relative z-10 px-3 py-2 text-white text-[10px] font-semibold rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default GlassyRippleButton;
