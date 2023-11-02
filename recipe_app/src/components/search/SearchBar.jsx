import React, { Component } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SearchBar.module.css";
import SearchResult from "./SearchResult.jsx";
import SearchResultList from "./SearchResultList.jsx";
import SelectedItemsList from "./SelectedItemsList.jsx";
import ItemListElement from "./ItemListElement";

function SearchBar() {
  const [textInput, setTextInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [item, setItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${textInput}&limit=3`
        );
        console.log("styles['hidden']: ", styles["hidden"]);
        console.log("styles['suggestions']: ", styles["suggestions"]);
        console.log("=========================");
        console.log("suggestions: ", suggestions);
        console.log("=========================");

        setSuggestions(data["products"]);

        console.log("=========================");
        console.log("data: ", data);
        console.log("=========================");
        console.log("data['products']: ", data["products"]);
        console.log("=========================");
      } catch (err) {
        console.log("err: ", err);
      }
    };
    fetchData();
  }, [textInput]);

  function handleChange(event) {
    setTextInput(event.target.value);
    console.log("textInput: ", textInput);
    // let suggests = trie.getSuggestions(textInput);
    // console.log("suggests: ", suggests);
  }

  function handleFocus() {
    console.log("HANDLING FOCUS");
    setHideSuggestions(false);
  }

  // async function handleBlur() {
  //   console.log("HANDLING BLUR");
  //   setTimeout(() => {
  //     setHideSuggestions(true);
  //   }, 200);
  // }

  // function handleClick(title) {
  //   console.log("title: ", title);
  //   // console.log("event['products']['title']: ", event["products"]["title"]);
  //   console.log("item: ", item);
  //   console.log("selectedItems: ", selectedItems);
  //   setItem(suggestions.find((s) => s["title"] === title));
  //   setSelectedItems([...selectedItems, title]);
  // }

  function handleClick(title) {
    const newItem = suggestions.find((s) => s.title === title);
    if (newItem) {
      setSelectedItems([...selectedItems, newItem]);
      setTextInput(""); // Clear the search input after selection
    }
  }

  function removeItem(index) {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  }
  function handleRemoveItem(index) {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  }
  // {
  //               <SelectedItemsList
  //                 selectedItems={selectedItems}
  //                 onRemoveItem={handleRemoveItem}
  //               />
  //             }

  // {selectedItems.map((item, index) => (
  //   <div key={item.title} className="selected-item">
  //     {item.title}
  //     <button
  //       onClick={() => handleRemoveItem(index)}
  //       className="remove-button"
  //     >
  //       X
  //     </button>
  //   </div>
  // ))}
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <input
            type="text"
            className={styles.searchText}
            value={textInput}
            // onClick={handleClick}
            onChange={handleChange}
            onFocus={handleFocus}
            // onBlur={handleBlur}
            placeholder="Search..."
          />
          <div
            className={`${styles["suggestions"]} ${
              hideSuggestions && styles.hidden
            }`}
          >
            {suggestions.map((suggest) => (
              <div
                className={styles["suggest"]}
                onClick={() => handleClick(suggest.title)}
              >
                {suggest["title"]}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div>
            {selectedItems.map((item, index) => (
              <ItemListElement
                key={item.title}
                item={item}
                onRemoveItem={() => handleRemoveItem(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
// return (
//   <>
//     <div className={styles.container}>
//       <div className={styles.leftContainer}>
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
//       </div>
//       <div className={styles.rightContainer}>
//         {/* <div className={styles.resultsContainer}> */}
//         {item && <SearchResult {...item} />}
//         {/* </div> */}
//       </div>
//     </div>
//   </>
// );
// } */}

// // export default SearchBar;
// function SearchBar() {
//   const [textInput, setTextInput] = useState("");
//   // const [suggestions, setSuggestions] = useState([]);
//   // const [trie, setTrie] = useState(new Trie());

//   // Create an instance of the Trie class
//   // const trie = new Trie(foodWords);

// function handleChange(event) {
//   setTextInput(event.target.value);
//   console.log("textInput: ", textInput);
//   // let suggests = trie.getSuggestions(textInput);
//   // console.log("suggests: ", suggests);
// }

//   function handleButtonClick() {
//     console.log("SEARCH BUTTON CLICKED: ", textInput);
//   }

//   // Event handler for keydown
//   function handleKeyDown(event) {
//     if (event.key === "Enter") {
//       // Handle the Enter key press
//       console.log("ENTER KEY PRESSED");
//       console.log("ENTER CLICK TEXT OUT: ", textInput);
//     }
//   }

//   return (
//     <div className="search-bar">
// <input
//   type="text"
//   onChange={handleChange}
//   onKeyDown={handleKeyDown}
//   placeholder="Search..."
// />
//       <button
//         type="button"
//         className="btn btn-primary"
//         onClick={handleButtonClick}
//       >
//         Search
//       </button>
//     </div>
//   );
// }

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
