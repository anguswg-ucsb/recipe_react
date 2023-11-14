import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./SearchBar.module.css";

function SearchBar({ addSelectedItems, onAddSearchBar, onRemoveSearchBar }) {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [transformed, setTransformed] = useState(false); // New state for transformation
  // const [inputValues, setInputValues] = useState([""]);
  // const [focusedInputIndex, setFocusedInputIndex] = useState(0);

  // const containerRef = useRef(null);
  // useEffect(() => {
  //   function handler(event) {
  //     if (event.target !== containerRef.current) {
  //       return;
  //     }
  //     switch (event.code) {
  //       case "Enter":
  //       case "Space":
  //         setIsOpen((prev) => !prev);
  //         if (isOpen) {
  //           selectOption(suggestions[highlightedIndex].title);
  //         }
  //         break;
  //       case "ArrowUp":
  //       case "ArrowDown": {
  //         if (!isOpen) {
  //           setIsOpen(true);
  //           break;
  //         }

  //         const new_val =
  //           highlightedIndex + (event.code === "ArrowDown" ? 1 : -1);

  //         if (new_val >= 0 && new_val < suggestions.length) {
  //           setHighlightedIndex(new_val);
  //         }
  //         break;
  //       }
  //       case "Escape":
  //         setIsOpen(false);
  //         break;
  //     }
  //   }
  //   containerRef.current.addEventListener("keydown", handler);

  //   return () => {
  //     containerRef.current.removeEventListener("keydown", handler);
  //   };
  // }, [isOpen, highlightedIndex, suggestions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${inputText}&limit=3`
        );

        setSuggestions(data["products"]);
      } catch (err) {
        console.log("err: ", err);
      }
    };
    fetchData();
  }, [inputText]);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  function handleChange(event) {
    setInputText(event.target.value);
  }

  function removeOptions() {
    setInputText("");
    setSelectedItems([]);
  }

  function selectOption(option) {
    setInputText(option);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (highlightedIndex < suggestions.length - 1) {
        setHighlightedIndex((prevIndex) => prevIndex + 1);
        // setSelectedItem(suggestions[highlightedIndex + 1]);
      }
      // Handle down arrow key press
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (highlightedIndex > 0) {
        setHighlightedIndex((prevIndex) => prevIndex - 1);
      }
      // if (highlightedIndex < suggestions.length - 1 && highlightedIndex >= 0) {

      // }

      // Handle up arrow key press
    } else if (event.key === "Enter") {
      console.log("ENTER PRESSED");
      console.log("----> event: ", event);
      console.log("----> suggestions: ", suggestions);
      console.log(
        "---->   suggestions[highlightedIndex]: ",
        suggestions[highlightedIndex]
      );
      console.log("--> UPDATING selectedItems: ", selectedItems);
      // setHighlightedIndex((prevIndex) => prevIndex - 1);
      const updatedItems = [...selectedItems, suggestions[highlightedIndex]];

      selectOption(suggestions[highlightedIndex].title);

      // add the newly selected item to the selected items list
      setSelectedItems(updatedItems);

      // close the suggestion dropdown
      setIsOpen(false);
      setHideSuggestions(true);

      // Transform input into a div
      setTransformed(true);

      if (suggestions[highlightedIndex]) {
        // Pass the selected item to the parent
        onAddSearchBar(suggestions[highlightedIndex].title);
      }

      // Handle Enter key press
      // setInputText(option);
      // setInputText(suggestions[highlightedIndex - 1]);
    } else if (event.key === "Backspace") {
      if (!inputText && transformed) {
        onRemoveSearchBar(); // Call the function to remove the SearchBar

        if (selectedItems.length === 1) {
          // If there's only one input left, transform it back to an input element
          setTransformed(false);
        }
      }
    }
  }

  function handleItemClick(title) {
    console.log("--> UPDATING selectedItems: ", selectedItems);
    const updatedItems = [
      ...selectedItems,
      suggestions.find((s) => s["title"] === title),
    ];
    setSelectedItems(updatedItems);
    if (suggestions.find((s) => s.title === title)) {
      // Pass the selected item to the parent
      onAddSearchBar(suggestions.find((s) => s.title === title).title);
    }
  }

  function isOptionSelected(option) {
    return option.title === inputText;
  }

  // Function to handle removing the div
  function handleRemoveClick() {
    setTransformed(false);
    setInputText("");
    setSelectedItems([]);
  }

  function onTrigger(event) {
    // event.preventDefault();
    addSelectedItems(event);
    // event.preventDefault();
  }

  return (
    <>
      {transformed ? ( // Conditional rendering: Input or transformed div
        <div className={styles.transformedDiv}>
          <span>{inputText}</span>
          <button onClick={onRemoveSearchBar}>&times;</button>
        </div>
      ) : (
        <input
          type="text"
          autoFocus
          className={styles.textbox}
          value={inputText}
          onClick={() => setIsOpen((prev) => !prev)}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setHideSuggestions(false)}
          onKeyDown={handleKeyDown}
          onBlur={async () => {
            setTimeout(() => {
              setHideSuggestions(true);
            }, 200);
          }}
          placeholder="Search..."
        />
      )}
      {transformed ? ( // Conditional rendering: No clear button for div
        <div className={styles.emptyDiv}></div>
      ) : (
        <button
          className={styles["clear-btn"]}
          onClick={(e) => {
            e.stopPropagation();
            removeOptions();
          }}
        >
          &times;
        </button>
      )}
      <ul
        className={`${styles["options"]} ${
          hideSuggestions && styles["hidden"]
        }`}
      >
        {suggestions.map((suggest, index) => (
          <li
            key={suggest.label}
            className={`${styles.option} ${
              isOptionSelected(suggest) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(suggest.title);
              handleItemClick(suggest.title);
              setIsOpen(false);
              setHideSuggestions(false);
              onTrigger(suggest.title);
              // Transform input into a div
              setTransformed(true);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {suggest.title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default SearchBar;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import styles from "./SearchBar.module.css";

// function SearchBar({
//   addSelectedItems,
//   onAddSearchBar,
//   onRemoveSearchBar,
//   element_index,
// }) {
//   const [query, setQuery] = useState("");
//   const [items, setItems] = useState([]);

//   const [transformed, setTransformed] = useState(false); // New state for transformation

//   function removeOptions() {
//     setQuery("");
//     setItems([]);
//   }

//   function onTrigger(event) {
//     // event.preventDefault();
//     addSelectedItems(event);
//     // event.preventDefault();
//   }

//   function handleKeyDown(event) {
//     if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       console.log("----> query: ", query);
//       console.log("----> items: ", items);

//       console.log("--> UPDATING selectedItems: ", items);
//       // setHighlightedIndex((prevIndex) => prevIndex - 1);
//       const updatedItems = [...items, query];
//       console.log("----> updatedItems: ", updatedItems);
//       // selectOption(suggestions[highlightedIndex].title);

//       // add the newly selected item to the selected items list
//       setItems(updatedItems);
//       addSelectedItems(query);
//       // addSelectedItems()
//       // Transform input into a div
//       setTransformed(true);

//       if (query) {
//         // Pass the selected item to the parent
//         onAddSearchBar(query);
//       }

//       // Handle Enter key press
//       // setInputText(option);
//       // setInputText(suggestions[highlightedIndex - 1]);
//     } else if (event.key === "Backspace") {
//       if (!query && transformed) {
//         onRemoveSearchBar(); // Call the function to remove the SearchBar

//         if (items.length === 1) {
//           // If there's only one input left, transform it back to an input element
//           setTransformed(false);
//         }
//       }
//     }
//   }

//   // function handleItemClick(title) {
//   //   console.log("--> UPDATING selectedItems: ", selectedItems);
//   //   const updatedItems = [
//   //     ...selectedItems,
//   //     suggestions.find((s) => s["title"] === title),
//   //   ];
//   //   setSelectedItems(updatedItems);
//   //   if (suggestions.find((s) => s.title === title)) {
//   //     // Pass the selected item to the parent
//   //     onAddSearchBar(suggestions.find((s) => s.title === title).title);
//   //   }
//   // }

//   return (
//     <>
//       {transformed ? ( // Conditional rendering: Input or transformed div
//         <div className={styles.transformedDiv}>
//           <span>{query}</span>
//           <button onClick={(e) => onRemoveSearchBar(element_index)}>
//             &times;
//           </button>
//         </div>
//       ) : (
//         <input
//           type="text"
//           autoFocus
//           className={styles.textbox}
//           value={query}
//           onKeyDown={handleKeyDown}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search..."
//         />
//       )}
//       {transformed ? ( // Conditional rendering: No clear button for div
//         <div className={styles.emptyDiv}></div>
//       ) : (
//         <button
//           className={styles["clear-btn"]}
//           onClick={(e) => {
//             e.stopPropagation();
//             onRemoveSearchBar();
//           }}
//         >
//           &times;
//         </button>
//       )}
//     </>
//   );
// }

// export default SearchBar;
