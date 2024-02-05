import React from "react";
import Card from "./Card";

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  return (
    <Card>
      <span className="absolute left-4 top-4 text-neutral-400 text-lg xl:text-xl 2xl:text-2xl">
        {symbol}
      </span>
      <div className="w-full h-full flex items-center justify-around">
        <span className="mt-7 text-sm xl:text-4xl 2xl:text-3xl flex items-center">
          ${price}
          <span className="text-lg xl:text-xl 2xl:text-2xl text-neutral-400 m-2">
            {currency}
          </span>
        </span>
        <span
          className={`mt-5 text-xs xl:text-sm 2xl:text-lg ${
            change > 0 ? "text-lime-500" : "text-red-500"
          }`}
        >
          {change > 0 ? `+${change}` : change}{" "}
          <span>({changePercent > 0 ? `${changePercent}` : `${changePercent}`}%)</span>
        </span>
      </div>
    </Card>
  );
};

export default Overview;