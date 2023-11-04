import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./SearchBar.module.css";

function SearchBar({ parentCallback, onAddSearchBar, onRemoveSearchBar }) {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [transformed, setTransformed] = useState(false); // New state for transformation

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
      console.log("selectedItems: ", selectedItems);
      console.log("DOWN ARROW PRESSED");
      console.log("----> event: ", event);
      if (highlightedIndex < suggestions.length - 1) {
        setHighlightedIndex((prevIndex) => prevIndex + 1);
        // setSelectedItem(suggestions[highlightedIndex + 1]);
      }
      // Handle down arrow key press
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      console.log("selectedItems: ", selectedItems);
      console.log("UP ARROW PRESSED");
      console.log("----> event: ", event);
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
  //   {transformed ? ( // Conditional rendering: Input or transformed div
  //   <div className={styles.transformedDiv}>
  //     <span>{inputText}</span>
  //     <button onClick={onRemoveSearchBar}>&times;</button>
  //   </div>
  // )

  function onTrigger(event) {
    // event.preventDefault();
    parentCallback(event);
    // event.preventDefault();
  }

  return (
    <div tabIndex={0} className={styles.container}>
      {transformed ? ( // Conditional rendering: Input or transformed div
        <div className={styles.transformedDiv}>
          <span>{inputText}</span>
          <button onClick={onRemoveSearchBar}>&times;</button>
        </div>
      ) : (
        <input
          type="text"
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
      <div className={styles.divider}></div>
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
    </div>
  );
}

export default SearchBar;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./SearchBar.module.css";

// function SearchBar({ onAddSearchBar, onRemoveSearchBar }) {
//   const [inputText, setInputText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [hideSuggestions, setHideSuggestions] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [highlightedIndex, setHighlightedIndex] = useState(0);
//   const [transformed, setTransformed] = useState(false); // New state for transformation

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://dummyjson.com/products/search?q=${inputText}&limit=3`
//         );

//         setSuggestions(data["products"]);
//       } catch (err) {
//         console.log("err: ", err);
//       }
//     };
//     fetchData();
//   }, [inputText]);

//   useEffect(() => {
//     if (isOpen) {
//       setHighlightedIndex(0);
//     }
//   }, [isOpen]);

//   function handleChange(event) {
//     setInputText(event.target.value);
//   }

//   function removeOptions() {
//     setInputText("");
//     setSelectedItems([]);
//   }

//   function selectOption(option) {
//     setInputText(option);
//   }

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();
//       console.log("selectedItems: ", selectedItems);
//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex < suggestions.length - 1) {
//         setHighlightedIndex((prevIndex) => prevIndex + 1);
//         // setSelectedItem(suggestions[highlightedIndex + 1]);
//       }
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();
//       console.log("selectedItems: ", selectedItems);
//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex > 0) {
//         setHighlightedIndex((prevIndex) => prevIndex - 1);
//       }
//       // if (highlightedIndex < suggestions.length - 1 && highlightedIndex >= 0) {

//       // }

//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       console.log("----> suggestions: ", suggestions);
//       console.log(
//         "---->   suggestions[highlightedIndex]: ",
//         suggestions[highlightedIndex]
//       );
//       console.log("--> UPDATING selectedItems: ", selectedItems);
//       // setHighlightedIndex((prevIndex) => prevIndex - 1);
//       const updatedItems = [...selectedItems, suggestions[highlightedIndex]];

//       selectOption(suggestions[highlightedIndex].title);

//       // add the newly selected item to the selected items list
//       setSelectedItems(updatedItems);

//       // close the suggestion dropdown
//       setIsOpen(false);

//       // Transform input into a div
//       setTransformed(true);

//       if (suggestions[highlightedIndex]) {
//         // Pass the selected item to the parent
//         onAddSearchBar(suggestions[highlightedIndex].title);
//       }

//       // Handle Enter key press
//       // setInputText(option);
//       // setInputText(suggestions[highlightedIndex - 1]);
//     } else if (event.key === "Backspace") {
//       if (!inputText && transformed) {
//         onRemoveSearchBar(); // Call the function to remove the SearchBar
//       }
//     }
//   }

//   function handleItemClick(title) {
//     console.log("--> UPDATING selectedItems: ", selectedItems);
//     const updatedItems = [
//       ...selectedItems,
//       suggestions.find((s) => s["title"] === title),
//     ];
//     setSelectedItems(updatedItems);
//     if (suggestions.find((s) => s.title === title)) {
//       // Pass the selected item to the parent
//       onAddSearchBar(suggestions.find((s) => s.title === title).title);
//     }
//   }

//   function isOptionSelected(option) {
//     return option.title === inputText;
//   }

//   // Function to handle removing the div
//   function handleRemoveClick() {
//     setTransformed(false);
//     setInputText("");
//     setSelectedItems([]);
//   }

//   return (
//     <div tabIndex={0} className={styles.container}>
//       {transformed ? ( // Conditional rendering: Input or transformed div
//         <div className={styles.transformedDiv}>
//           <span>{inputText}</span>
//           <button onClick={handleRemoveClick}>&times;</button>
//         </div>
//       ) : (
//         <input
//           type="text"
//           className={styles.textbox}
//           value={inputText}
//           onClick={() => setIsOpen((prev) => !prev)}
//           onChange={(e) => setInputText(e.target.value)}
//           onFocus={() => setHideSuggestions(false)}
//           onKeyDown={handleKeyDown}
//           onBlur={async () => {
//             setTimeout(() => {
//               setHideSuggestions(true);
//             }, 200);
//           }}
//           placeholder="Search..."
//         />
//       )}
//       <div className={styles.divider}></div>
//       {transformed ? ( // Conditional rendering: No clear button for div
//         <div className={styles.emptyDiv}></div>
//       ) : (
//         <button
//           className={styles["clear-btn"]}
//           onClick={(e) => {
//             e.stopPropagation();
//             removeOptions();
//           }}
//         >
//           &times;
//         </button>
//       )}
//       <ul
//         className={`${styles["options"]} ${
//           hideSuggestions && styles["hidden"]
//         }`}
//       >
//         {suggestions.map((suggest, index) => (
//           <li
//             key={suggest.label}
//             className={`${styles.option} ${
//               isOptionSelected(suggest) ? styles.selected : ""
//             } ${index === highlightedIndex ? styles.highlighted : ""}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               selectOption(suggest.title);
//               handleItemClick(suggest.title);
//               setIsOpen(false);

//               // Transform input into a div
//               setTransformed(true);
//             }}
//             onMouseEnter={() => setHighlightedIndex(index)}
//           >
//             {suggest.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SearchBar;

// import React, { Component } from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./SearchBar.module.css";
// // import SearchResult from "./SearchResult.jsx";

// function SearchBar() {
//   // const options = [
//   //   { label: "First", value: 1 },
//   //   { label: "Second", value: 2 },
//   //   // { label: "Third", value: 3 },
//   //   // { label: "Fourth", value: 4 },
//   //   // { label: "Fifth", value: 5 },
//   // ];
//   const [textInput, setTextInput] = useState("");

//   const [suggestions, setSuggestions] = useState([]);
//   const [hideSuggestions, setHideSuggestions] = useState(true);

//   const [isOpen, setIsOpen] = useState(false);
//   const [items, setItems] = useState([]);
//   const [highlighted, setHighlighted] = useState(0);

//   // when the text input changes (textInput dependency array changes), fetch new data from search endpoint
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://dummyjson.com/products/search?q=${textInput}&limit=3`
//         );

//         console.log("=========================");
//         console.log("suggestions: ", suggestions);
//         console.log("data['products']: ", data["products"]);
//         console.log("=========================");

//         setSuggestions(data["products"]);
//       } catch (err) {
//         console.log("err: ", err);
//       }
//     };
//     fetchData();
//   }, [textInput]);

//   // if the box is opened then closed and reopened,
//   // the highlighted index is reset back to the first element
//   useEffect(() => {
//     if (isOpen) {
//       setHighlighted(0);
//     }
//   }, [isOpen]);

//   function handleChange(event) {
//     setTextInput(event.target.value);
//     console.log("textInput: ", textInput);
//     // let suggests = trie.getSuggestions(textInput);
//     // console.log("suggests: ", suggests);
//   }

//   function removeOptions() {
//     setTextInput(""); // Clear the input value
//     setItems([]);
//   }

//   function selectOption(option) {
//     console.log("option: ", option);
//     setTextInput(option);
//     // setSuggestions([]);
//   }

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();
//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//     }
//   }

//   function handleItemClick(title) {
//     console.log("title: ", title);
//     console.log("items: ", items);
//     // console.log("event['products']['title']: ", event["products"]["title"]);
//     // console.log("item: ", item);
//     // setItem(suggestions.find((s) => s["title"] === title));

//     const updated_items = [
//       ...items,
//       suggestions.find((s) => s["title"] === title),
//     ];

//     setItems(updated_items);
//   }
//   function isOptionSelected(option) {
//     console.log("option: ", option, "vs. textInput: ", textInput);
//     console.log("option.title: ", option, "vs. textInput: ", textInput);
//     return option.title === textInput;
//   }

//   return (
//     <div tabIndex={0} className={styles.container}>
//       <input
//         type="text"
//         className={styles.textbox}
//         value={textInput}
//         onClick={() => setIsOpen((prev) => !prev)}
//         // onChange={handleChange}
//         onChange={(e) => {
//           setTextInput(e.target.value);
//         }}
//         // onFocus={handleFocus}
//         onFocus={() => setHideSuggestions(false)}
//         onBlur={async () => {
//           setTimeout(() => {
//             setHideSuggestions(true);
//           }, 200);
//         }}
//         // onBlur={() => setIsOpen(false)}
//         placeholder="Search..."
//       />
//       <div className={styles.divider}></div>
//       <button
//         className={styles["clear-btn"]}
//         onClick={(e) => {
//           e.stopPropagation();
//           removeOptions();
//         }}
//       >
//         &times;
//       </button>
//       <ul
//         className={`${styles["options"]} ${
//           hideSuggestions && styles["hidden"]
//         }`}
//       >
//         {/* <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}> */}
//         {suggestions.map((suggest, index) => (
//           <li
//             key={suggest.label}
//             className={`${styles.option} ${
//               isOptionSelected(suggest) ? styles.selected : ""
//             }
//             ${index === highlighted ? styles.highlighted : ""}`}
//             onClick={(e) => {
//               console.log("Clicked on: ", suggest.title);
//               e.stopPropagation();
//               selectOption(suggest.title);
//               handleItemClick(suggest.title);
//               setIsOpen(false);
//             }}
//             onMouseEnter={() => setHighlighted(index)}
//           >
//             {suggest.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SearchBar;

// function SearchBar() {
//   const [textInput, setTextInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [hideSuggestions, setHideSuggestions] = useState(true);
//   const [item, setItem] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `https://dummyjson.com/products/search?q=${textInput}&limit=3`
//         );
//         console.log("styles['hidden']: ", styles["hidden"]);
//         console.log("styles['suggestions']: ", styles["suggestions"]);
//         console.log("=========================");
//         console.log("suggestions: ", suggestions);
//         console.log("=========================");

//         setSuggestions(data["products"]);

//         console.log("=========================");
//         console.log("data: ", data);
//         console.log("=========================");
//         console.log("data['products']: ", data["products"]);
//         console.log("=========================");
//       } catch (err) {
//         console.log("err: ", err);
//       }
//     };
//     fetchData();
//   }, [textInput]);

// function handleChange(event) {
//   setTextInput(event.target.value);
//   console.log("textInput: ", textInput);
//   // let suggests = trie.getSuggestions(textInput);
//   // console.log("suggests: ", suggests);
// }

//   function handleFocus() {
//     console.log("HANDLING FOCUS");
//     setHideSuggestions(false);
//   }

//   // async function handleBlur() {
//   //   console.log("HANDLING BLUR");
//   //   setTimeout(() => {
//   //     setHideSuggestions(true);
//   //   }, 200);
//   // }

// function handleClick(title) {
//   console.log("title: ", title);
//   // console.log("event['products']['title']: ", event["products"]["title"]);
//   console.log("item: ", item);
//   setItem(suggestions.find((s) => s["title"] === title));
// }

//   return (
//     <>
//       <div className={styles.container}>
//         <input
//           type="text"
//           className={styles.searchText}
//           value={textInput}
//           // onClick={handleClick}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           // onBlur={handleBlur}
//           placeholder="Search..."
//         />
//         <div
//           className={`${styles["suggestions"]} ${
//             hideSuggestions && styles.hidden
//           }`}
//         >
//           {suggestions.map((suggest) => (
//             <div
//               className={styles["suggest"]}
//               onClick={() => handleClick(suggest.title)}
//             >
//               {suggest["title"]}
//             </div>
//           ))}
//         </div>
//         <div className={styles.searchItem}>
//           {item && <SearchResult {...item} />}
//         </div>
//       </div>
//     </>
//   );
// }

// // // export default SearchBar;
// // function SearchBar() {
// //   const [textInput, setTextInput] = useState("");
// //   // const [suggestions, setSuggestions] = useState([]);
// //   // const [trie, setTrie] = useState(new Trie());

// //   // Create an instance of the Trie class
// //   // const trie = new Trie(foodWords);

// // function handleChange(event) {
// //   setTextInput(event.target.value);
// //   console.log("textInput: ", textInput);
// //   // let suggests = trie.getSuggestions(textInput);
// //   // console.log("suggests: ", suggests);
// // }

// //   function handleButtonClick() {
// //     console.log("SEARCH BUTTON CLICKED: ", textInput);
// //   }

// //   // Event handler for keydown
// //   function handleKeyDown(event) {
// //     if (event.key === "Enter") {
// //       // Handle the Enter key press
// //       console.log("ENTER KEY PRESSED");
// //       console.log("ENTER CLICK TEXT OUT: ", textInput);
// //     }
// //   }

// //   return (
// //     <div className="search-bar">
// // <input
// //   type="text"
// //   onChange={handleChange}
// //   onKeyDown={handleKeyDown}
// //   placeholder="Search..."
// // />
// //       <button
// //         type="button"
// //         className="btn btn-primary"
// //         onClick={handleButtonClick}
// //       >
// //         Search
// //       </button>
// //     </div>
// //   );
// // }

// export default SearchBar;

// class SearchBar extends Component {
//     constructor() {
//         super();
//         this.state = {
//           textInput: "",
//         };
//       }
//       incrementWords = () => {
//         this.setState({ count: this.state.count + 1 });
//       }

//   render() {
//     return (
//       <div className="search-bar">
//         <input type="text" placeholder="Search..." />
//         <button type="button" className="btn btn-primary">
//           Search
//         </button>
//       </div>
//     );
//   }
// }
// const foodWords = [
//   "apple",
//   "banana",
//   "cherry",
//   "grape",
//   "strawberry",
//   "blueberry",
//   "orange",
//   "mango",
//   "watermelon",
//   "pineapple",
//   "kiwi",
//   "avocado",
//   "peach",
//   "pear",
//   "plum",
//   "lemon",
//   "lime",
//   "grapefruit",
//   "pomegranate",
//   "coconut",
//   "apricot",
//   "fig",
//   "nectarine",
//   "cantaloupe",
//   "honeydew",
//   "broccoli",
//   "carrot",
//   "potato",
//   "cucumber",
//   "eggplant",
//   "lettuce",
//   "pepper",
//   "tomato",
//   "zucchini",
//   "pumpkin",
//   "onion",
//   "garlic",
//   "celery",
//   "cabbage",
//   "cauliflower",
//   "spinach",
//   "strawberry",
//   "blueberry",
//   "raspberry",
//   "blackberry",
//   "cranberry",
//   "papaya",
//   "passionfruit",
//   "guava",
//   "starfruit",
// ];
