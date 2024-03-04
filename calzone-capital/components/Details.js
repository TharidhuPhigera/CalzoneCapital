import React from "react";

const Details = ({ details }) => {
  const detailsList = {
    exchange: "Exchange",
    currency: "Currency",
    finnhubIndustry: "Industry",
  };

  const convertMillionToBillion = (number) => {
    return (number / 1000).toFixed(2);
  };

  return (
    <ul className={`flex`}>
    {Object.keys(detailsList).map((item, index, array) => {
      return (
        <li key={item} className="flex justify-between items-center">
          <span className="text-xs mr-2">
            {details[item]}
          </span>
          {index !== array.length - 1 && <span className="text-xs mr-2">|</span>}
        </li>
      );
    })}
  </ul>
  )  
};

export default Details;