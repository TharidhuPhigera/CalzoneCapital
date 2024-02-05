import React from "react";
import Search from "./Search";

const Header = ({ name }) => {
  return (
    <>
      <div>
        <h1 className="pt-14 text-4xl">{name}</h1>
        <Search />
      </div>
    </>
  );
};

export default Header;