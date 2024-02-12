import React from "react";
import Card from "./Card";

const Overview = ({ symbol, price, change, changePercent, currency, closePrice }) => {
  return (
    <Card>
      <span className="absolute left-4 top-4 text-neutral-400 text-sm md:text-lg xl:text-xl 2xl:text-2xl">
        {symbol}
      </span>
      <div className="w-full h-full flex items-center justify-around">
        <span className="mt-4 text-sm md:text-xl 2xl:text-2xl flex items-center">
          ${price}
        </span>
        <span
          className={`mt-5 text-xs md:text-sm 2xl:text-lg ${
            change > 0 ? "text-lime-500" : "text-red-500"
          }`}
        >
          {change > 0 ? `+${change}` : `${change}`}{" "}
          <span>({changePercent > 0 ? `${changePercent}` : `${changePercent}`}%)</span>
        </span>
      </div>
      <div className="mt-1">
        <span className="text-xs md:text-sm">Previous Close: ${closePrice}</span>
      </div>
    </Card>
  );
};

export default Overview;