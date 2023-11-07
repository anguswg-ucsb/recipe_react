// React component for the search bar with chips
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import styles from "./SearchBar.module.css";

function SearchBarWithChips() {
  const [query, setQuery] = useState("");

  const [isHidden, setIsHidden] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // ref for the input element
  const inputRef = useRef();

  // delay search query until 1 second after user stops typing
  useDebounce(
    () => {
      const fetchData = async () => {
        try {
          console.log("EXECUTING QUERY: ", query);
          console.log(
            "query url: ",
            `https://dummyjson.com/products/search?q=${query}&limit=3`
          );

          const { data } = await axios.get(
            `https://dummyjson.com/products/search?q=${query}&limit=3`
          );
          //   console.log("response: ", response);
          console.log("data: ", data);
          console.log("data['products']: ", data["products"]);

          // set the suggestions to the products array
          setSuggestions(data["products"] || []);
          //   setSuggestions(data["products"]);
        } catch (error) {
          console.log(error);
        }
      };
      if (query) {
        fetchData();
      }
      //   fetchData();
    },
    1000,
    [query]
  );

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //   console.log("EXECUTING QUERY: ", query);
  //   console.log(
  //     "query url: ",
  //     `https://dummyjson.com/products/search?q=${query}&limit=3`
  //   );
  //   const { data } = await axios.get(
  //     `https://dummyjson.com/products/search?q=${query}&limit=3`
  //   );
  //   //   console.log("response: ", response);
  //   console.log("data: ", data);
  //   console.log("data['products']: ", data["products"]);
  //         setSuggestions(data["products"]);
  //       } catch (err) {
  //         console.log("err: ", err);
  //       }
  //     };
  //     fetchData();
  //   }, [query]);

  useEffect(() => {
    if (isHidden) {
      setHighlightedIndex(0);
    }
  }, [isHidden]);

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      console.log("DOWN ARROW PRESSED");
      console.log("----> event: ", event);
      if (highlightedIndex < suggestions.length - 1) {
        setHighlightedIndex((prevIndex) => prevIndex + 1);
        // setSelectedItem(suggestions[highlightedIndex + 1]);
      }
      // Handle down arrow key press
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      console.log("UP ARROW PRESSED");
      console.log("----> event: ", event);
      if (highlightedIndex > 0) {
        setHighlightedIndex((prevIndex) => prevIndex - 1);
      }

      // Handle up arrow key press
    } else if (event.key === "Enter") {
      console.log("ENTER PRESSED");
      console.log("----> event: ", event);
      console.log("--> UPDATING selectedItems: ", selectedItems);
      const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
      console.log("--> UPDATING updatedItems: ", updatedItems);
      console.log(
        "--> SELECTING OPTION suggestions[highlightedIndex].title: ",
        suggestions[highlightedIndex].title
      );

      selectOption(suggestions[highlightedIndex].title);

      // add the newly selected item to the selected items list
      setSelectedItems(updatedItems);

      // close the suggestion dropdown
      setIsHidden(true);

      clearSearch();
      inputRef.current.focus();
    } else if (event.key === "Backspace" && query === "") {
      event.preventDefault();
      console.log("BACKSPACE CLICKED");
      console.log("---> event: ", event);
      console.log("----> query: ", query);

      let selected_items = selectedItems;
      console.log("------> selected_items: ", selected_items);
      console.log("------> selected_items.length: ", selected_items.length);
      // remove the last item from the selected items list
      if (selected_items.length > 0) {
        // setIsHidden(true);
        setSelectedItems(selected_items.slice(0, -1));
      }

      //   if (selected_items.length === 0) {
      //     setIsHidden(false);
      //   }
      // refocus on the input
      inputRef.current.focus();

      //   setIsHidden(true);
    }
  }

  function handleItemClick(item) {
    console.log("handleItemClick CLICKED");
    console.log("----> item: ", item);
    const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
    console.log("--->handleItemClick updatedItems: ", updatedItems);
    setSelectedItems(updatedItems);
    selectOption(suggestions[highlightedIndex].title);
    clearSearch();
    inputRef.current.focus(); // Refocus on the input
  }

  function handleDeleteClick(toBeRemoved) {
    console.log("DELETE CLICKED");
    console.log("----> toBeRemoved: ", toBeRemoved);

    const newSelectedItems = selectedItems.filter(
      (item) => item !== toBeRemoved
    );
    setIsHidden(true);
    setSelectedItems(newSelectedItems);
    // inputRef.current.focus(); // Refocus on the input
  }

  function selectOption(option) {
    setQuery(option);
  }

  function isOptionSelected(option) {
    return option.title === query;
  }

  function clearSearch() {
    setQuery("");
    setIsHidden(false);
    setSuggestions([]);
  }

  // <button onClick={() => handleDeleteClick(item)}>&times;</button>
  // onBlur={async () => {
  //   setTimeout(() => {
  //     setIsHidden(true);
  //   }, 200);
  // }}
  // onBlur={() => {setIsHidden(true)}

  return (
    <>
      <div
        className={styles.container}
        // onFocus={() => setIsHidden(false)}
        // onBlur={() => setIsHidden(true)}
      >
        {selectedItems.map((item) => (
          <div className={styles.transformedDiv}>
            <span>{item.title}</span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteClick(item);
                clearSearch();
              }}
            >
              &times;
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          onFocus={() => setIsHidden(false)}
          onBlur={async () => {
            setTimeout(() => {
              setIsHidden(true);
            }, 200);
          }}
          //   onBlur={() => setIsHidden(true)}
          type="text"
          //   autoFocus
          className={styles.textbox}
          value={query}
          // onClick={() => setIsHidden((prev) => !prev)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
        />
        <ul
          className={`${styles["options"]} ${!isHidden ? styles["show"] : ""}`}
        >
          {suggestions.map((suggest, index) => (
            <li
              key={index}
              className={`${styles.option} 
            ${isOptionSelected(suggest) ? styles.selected : ""} 
            ${index === highlightedIndex ? styles.highlighted : ""}`}
              onClick={(e) => {
                // e.stopPropagation();
                selectOption(suggest.title);
                handleItemClick(suggest.title);
                setIsHidden(false);
                clearSearch();
              }}
              onMouseEnter={() => {
                console.log("MOUSE ENTERED");
                setHighlightedIndex(index);
              }}
            >
              {suggest.title}
            </li>
          ))}
        </ul>
      </div>
      <br></br>
      <div>
        {selectedItems.map((item) => (
          <div className={styles.transformedDiv}>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchBarWithChips;
