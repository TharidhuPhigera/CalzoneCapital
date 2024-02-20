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
      <ul
        className={`w-full flex justify-between`}
      >
        {Object.keys(detailsList).map((item) => {
          return (
            <li key={item} className="flex justify-between items-center py-1">
              {/* <span className="text-sm">{detailsList[item]}</span> */}
              <span className="text-xs mr-5">
                {details[item]}
              </span>
            </li>
          );
        })}
      </ul>
  );
};

export default Details;