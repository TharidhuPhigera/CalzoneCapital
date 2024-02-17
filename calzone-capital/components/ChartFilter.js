import React from "react";

const ChartFilter = ({ text, active, onClick }) => {
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className={`w-10 m-2 h-6 border-1 rounded-md flex items-center justify-center cursor-pointer ${
        active
          ? "bg-[#38bfc3] border-[#38bfc3] text-gray-100"
          : "border border-[#38bfc3] text-[#38bec3a8]"
      } transition duration-200 hover:bg-[#38bfc3] hover:text-gray-100 hover:border-[#38bfc3]`}
    >
      {text}
    </button>
  );
};

export default ChartFilter;