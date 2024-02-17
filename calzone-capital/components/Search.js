import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import SearchResults from "./SearchResults";
import { searchSymbol } from "../app/api/stock/stock-api";

const Search = () => {
  const [input, setInput] = useState("");
  const [bestMatches, setBestMatches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const clear = () => {
    setInput("");
    setBestMatches([]);
    setShowResults(false);
  };

  const updateBestMatches = async () => {
    try {
      if (input) {
        const searchResults = await searchSymbol(input);
        const result = searchResults.result;
        setBestMatches(result);
        setShowResults(true);
      } else {
        setBestMatches([]);
        setShowResults(false);
      }
    } catch (error) {
      setBestMatches([]);
      setShowResults(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateBestMatches();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  return (
    <div className={`relative z-50 w-96`}>
      <div className={`flex items-center bg-[#F5F7F8] my-4 shadow-md rounded-md`}>
        <input
          type="text"
          value={input}
          className={`w-full px-4 py-2 bg-[#F5F7F8] focus:outline-none rounded-md`}
          placeholder="Search stock..."
          onChange={(event) => setInput(event.target.value)}
        />
        {input && (
          <button onClick={clear} className="m-1">
            <XMarkIcon className="h-4 w-4 fill-gray-500" />
          </button>
        )}
        <button
          onClick={updateBestMatches}
          className="h-8 w-8 bg-[#38bfc3] rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-1 ring-[#247a7d]"
        >
          <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
        </button>
      </div>
      {showResults && input && bestMatches.length > 0 && (
        <SearchResults results={bestMatches} />
      )}
    </div>
  );
};

export default Search;
