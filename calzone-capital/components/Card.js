import React, { useContext } from "react";

const Card = ({ children }) => {
  return (
    <div
      className="w-full h-full rounded-md shadow-md relative p-5 border-1 bg-[#F5F7F8] border-[#38bfc3]">
      {children}
    </div>
  );
};

export default Card;