import React from "react";
import Card from "./Card";

const Overview = ({ symbol, price, change, changePercent, closePrice }) => {
  return (
    <Card>
      <span className="absolute left-4 top-4 text-neutral-400 text-sm md:text-lg xl:text-xl 2xl:text-2xl">
        {symbol}
      </span>
      <div className="w-full h-full mt-7 items-center justify-around">
        <span className="mt-3 text-sm md:text-xl 2xl:text-2xl items-center">
          ${price}
        </span>
        <span className={`ml-4 text-xs md:text-sm 2xl:text-lg ${change > 0 ? "text-lime-500" : "text-red-500"}`}>
          {change > 0 ? `+${change}` : `${change}`}{" "}
          <span>
            ({changePercent > 0 ? '↑' : '↓'}{Math.abs(changePercent).toFixed(2)}%)
          </span>
        </span>
        <div className="pt-1">
          <span className="text-xs md:text-sm">Previous Close: ${closePrice}</span>
        </div>
      </div>
    </Card>
  );
};

export default Overview;