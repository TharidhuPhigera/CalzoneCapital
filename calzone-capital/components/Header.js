import React from "react";
import Search from "./Search";

const Header = ({ name }) => {
  return (
    <>
      <div>
        <Search />
        <h1 className="text-4xl">{name}</h1>
      </div>
    </>
  );
};

export default Header;