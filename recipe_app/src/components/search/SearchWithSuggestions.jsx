import React, { useState } from "react";

const SearchWithSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);

    // Simulating suggestions fetching with a delay
    setTimeout(() => {
      setSuggestions(["Apple", "Banana", "Cherry", "Date"]);
      setShowSuggestions(true);
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };
  // className={`z-100 list-none border border-solid border-gray-300 max-h-40 overflow-y-scroll rounded-md w-full left-0 top-full bg-white ${
  //   // className={`z-100 absolute list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md w-full left-0 top-full bg-white ${
  //   state.query && state.ingredients.length > 0 && !state.isHidden
  //     ? ""
  //     : "hidden"
  // }`}
  return (
    <div className="relative z-0">
      {/* Search Input */}
      <div
        // ref={inputRef}
        // tabIndex={0}
        className="fixed z-10 flex flex-wrap justify-center items-center inset-x-0 top-0 left-1/2 transform -translate-x-1/2 gap-1 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"

        // className="fixed z-10 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="z-10 p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <ul
            // className="absolute w-full left-0 top-full left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 w-80 rounded-md overflow-hidden"
            className="absolute list-none border w-full top-full left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 w-80 rounded-md overflow-hidden"
            style={{ marginTop: "0.5rem" }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rest of the page content */}
      <div className="absolute z-100 mt-20 grid grid-cols-3 gap-4 left-1/2 transform -translate-x-1/2">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className="h-20 bg-blue-500 text-white flex items-center justify-center"
          >
            Content {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchWithSuggestions;
{
  /* <ul
              className={`z-100 list-none border border-solid border-gray-300 max-h-40 overflow-y-scroll rounded-md w-full left-0 top-full bg-white ${
                // className={`z-100 absolute list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md w-full left-0 top-full bg-white ${
                state.query && state.ingredients.length > 0 && !state.isHidden
                  ? ""
                  : "hidden"
              }`}
            >
              {state.ingredients.map((ingred, index) => (
                <li
                  key={`${ingred.length}_${index}`}
                  className={`p-2 cursor-pointer ${
                    isOptionSelected(ingred)
                      ? "p-2 cursor-pointer bg-emerald-100 text-yellow-500"
                      : undefined
                  } ${
                    index === state.highlightedIndex
                      ? "p-2 cursor-pointer bg-emerald-100 border rounded-md border-solid border-emerald-500"
                      : undefined
                  } 
                `} */
}
