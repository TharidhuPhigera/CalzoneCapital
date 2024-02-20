import React from "react";
import Search from "./Search";
import Details from "./Details";

const Header = ({ name, details }) => {
  return (
    <>
      <div>
        <Search />
        <h1 className="text-4xl">{name}</h1>
        <Details details={details} />
      </div>
    </>
  );
};

export default Header;
