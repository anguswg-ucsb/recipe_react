// ####################### GOOD TO GO (Single state object) #######################
// ####################### GOOD TO GO (Single state object) #######################

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";

// styling
import "bulma/css/bulma.min.css"; // Import Bulma styles
import styles from "./SearchBar.module.css";

import IngredientBadge from "./IngredientBadge";
import RecipeCard from "./RecipeCard";

import RecipeCardGrid from "./RecipeCardGrid";
import ResultGrid from "./ResultGrid";

function SearchBarWithChips() {
  const [state, setState] = useState({
    query: "",
    isHidden: true,
    ingredients: [],
    selectedItems: [],
    highlightedIndex: -1,
    result: [],
  });

  const inputRef = useRef();

  // delay search query until 1 second after user stops typing
  useDebounce(
    () => {
      const fetchData = async () => {
        try {
          console.log("EXECUTING QUERY: ", state.query);
          console.log("process.env: ", process.env); // remove thi
          console.log(
            "process.env.REACT_APP_API_URL: ",
            process.env.REACT_APP_API_URL
          );
          console.log(
            "query url: ",
            `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${state.query}&limit=5`
          );

          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${state.query}&limit=5`
          );

          console.log("data: ", data);
          console.log("data['suggestions']: ", data["suggestions"]);
          console.log("----> selected: ", state.ingredients);

          // set the ingredients to the products array
          setState((prevState) => ({
            ...prevState,
            ingredients: data["suggestions"] || [],
          }));

          //   // set the ingredients to the products array
          //   setState({ ...state, ingredients: data["suggestions"] || [] });
          console.log("Setting hidden to FALSE");

          setState((prevState) => ({ ...prevState, isHidden: false }));
        } catch (error) {
          console.log(error);
        }
      };
      if (state.query) {
        fetchData();
      }
    },
    1000,
    [state.query]
  );

  useEffect(() => {
    // base search URL by ingredients
    const base_url = `${process.env.REACT_APP_API_URL}/dev/api/v1/recipes-by-ingredients/?ingredients=`;

    // join all the selected ingredients with "&" delimiter and replace spaces with +
    const search_items = state.selectedItems
      .map((str) => str.replace(/\s+/g, "+"))
      .join("&ingredients=");

    // url to query the API for recipes based on the selected ingredients
    const search_url = `${base_url}${search_items}&limit=10`;

    console.log("=========================");
    console.log("==== SECOND API CALL ====");
    console.log("selectedItems: ", state.selectedItems);
    console.log("search_items: ", search_items);
    console.log("search_url: ", search_url);
    console.log("=========================");

    const fetchResultsData = async (url) => {
      try {
        console.log("---> QUERYING search_url:\n", search_url);

        const { data } = await axios.get(search_url);

        console.log("result: ", state.result);
        console.log("data: ", data);

        // // Update the results state with the fetched data
        // setState((prevState) => ({
        //   ...prevState,
        //   result: [...prevState.result, data],
        // }));

        setState((prevState) => ({
          ...prevState,
          result: data || [],
        }));
        console.log("=========================");
      } catch (error) {
        console.log(error);
      }
    };
    if (state.selectedItems.length === 0) {
      setState((prevState) => ({ ...prevState, result: [] }));
    }
    if (state.selectedItems.length > 0) {
      console.log("===== CLEARING RESULTS =====");
      // Clear the previous results before making new API calls
      setState((prevState) => ({ ...prevState, result: [] }));
      fetchResultsData(search_url);
      console.log("=========================");
    }
  }, [state.selectedItems]);

  // set the highlightedIndex state value to -1 when isHidden changes
  useEffect(() => {
    if (state.isHidden) {
      setState((prevState) => ({ ...prevState, highlightedIndex: -1 }));
    }
  }, [state.isHidden]);

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      console.log("DOWN ARROW PRESSED");
      console.log("----> event: ", event);
      if (state.highlightedIndex < state.ingredients.length - 1) {
        setState((prevState) => ({
          ...prevState,
          highlightedIndex: prevState.highlightedIndex + 1,
        }));
      }
      return;
      // Handle down arrow key press
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      console.log("UP ARROW PRESSED");
      console.log("----> event: ", event);
      if (state.highlightedIndex > 0) {
        setState((prevState) => ({
          ...prevState,
          highlightedIndex: prevState.highlightedIndex - 1,
        }));
      }

      // if ArrowUp is pressed and the highlightedIndex is at the beginning
      // of the suggestion array (index == 0),
      // then set highlightedIndex to -1 (default), allowing the user to enter their custom inputs
      if (state.highlightedIndex === 0) {
        setState((prevState) => ({ ...prevState, highlightedIndex: -1 }));
      }
      return;
      // Handle up arrow key press
    } else if (event.key === "Enter") {
      console.log("ENTER PRESSED");
      console.log("----> event: ", event);
      // if a non-empty query is given AND no suggested  ingredients are highlighted(-1 index)
      // THEN add the query to the selectedItems list
      if (state.query !== "" && state.highlightedIndex === -1) {
        console.log(
          "QUERY NOT EMPTY AND highlightedIndex  === -1, adding 'query' to selectedItems "
        );
        console.log("--> query: ", state.query);
        console.log("--> selectedItems: ", state.selectedItems);

        const updatedItems = [...state.selectedItems, state.query];

        console.log("--> UPDATING updatedItems: ", updatedItems);
        // setQuery(query);
        setState((prevState) => ({
          ...prevState,
          selectedItems: updatedItems,
        }));
        // setQuery("");
        clearSearch();
        inputRef.current.focus();
        return;
      }

      // if any suggested ingredients have been
      // put into ingredients state variable,
      // - select the highlighted ingredient
      // - add it to the selectedItems list
      // - close the ingredients dropdown (set hidden to true)
      // - clear the search bar
      // - refocus on the search bar
      if (state.ingredients.length > 0) {
        const updatedItems = [
          ...state.selectedItems,
          state.ingredients[state.highlightedIndex],
        ];

        console.log("--> UPDATING updatedItems: ", updatedItems);
        console.log(
          "--> SELECTING OPTION ingredients[highlightedIndex]: ",
          state.ingredients[state.highlightedIndex]
        );

        setState((prevState) => ({
          ...prevState,
          query: state.ingredients[state.highlightedIndex],
          selectedItems: updatedItems,
          isHidden: true,
        }));

        clearSearch();
        inputRef.current.focus();
        return;
      }

      // if no suggested ingredients have been put into ingredients state variable,
      // and a non-empty string has been given, then add this to the selectedItems state list
      if (state.query !== "") {
        console.log("--> highlightedIndex  === -1: ");
        console.log("--> query: ", state.query);

        const updatedItems = [...state.selectedItems, state.query];
        console.log("--> UPDATING updatedItems: ", updatedItems);
        setState((prevState) => ({
          ...prevState,
          selectedItems: updatedItems,
        }));
        // setQuery("");
        clearSearch();
        inputRef.current.focus();
        return;
      }
    } else if (event.key === "Backspace" && state.query === "") {
      event.preventDefault();

      let selected_items = state.selectedItems;
      console.log("------> selected_items: ", selected_items);
      console.log("------> selected_items.length: ", selected_items.length);
      // remove the last item from the selected items list
      if (selected_items.length > 0) {
        setState((prevState) => ({
          ...prevState,
          selectedItems: selected_items.slice(0, -1),
        }));
      }

      //   if (selected_items.length === 0) {
      //     setIsHidden(false);
      //   }
      // refocus on the input
      inputRef.current.focus();

      //   setIsHidden(true);
      return;
    }
  }

  // handle when a suggested ingredient is clicked from the suggested ingredients dropdown
  function handleItemClick(item) {
    console.log("handleItemClick CLICKED");
    console.log("----> item: ", item);
    const updatedItems = [
      ...state.selectedItems,
      state.ingredients[state.highlightedIndex],
    ];
    console.log("--->handleItemClick updatedItems: ", updatedItems);
    console.log(
      "--->handleItemClick ingredients[highlightedIndex].title: ",
      state.ingredients[state.highlightedIndex].title
    );

    setState((prevState) => ({
      ...prevState,
      selectedItems: updatedItems,
    }));

    clearSearch();
    inputRef.current.focus(); // Refocus on the input
  }

  // handle when the remove button is clicked on one of the IngredientBadge components
  function handleDeleteClick(toBeRemoved) {
    console.log("DELETE CLICKED");
    console.log("----> toBeRemoved: ", toBeRemoved);

    const newSelectedItems = state.selectedItems.filter(
      (item) => item !== toBeRemoved
    );
    setState((prevState) => ({
      ...prevState,
      isHidden: true,
      selectedItems: newSelectedItems,
    }));
    // inputRef.current.focus(); // Refocus on the input
  }

  function isOptionSelected(option) {
    return option === state.query;
  }
  //   // resets the query to an empty string and the ingredients to an empty array
  function clearSearch() {
    setState((prevState) => ({
      ...prevState,
      query: "",
      isHidden: false,
      ingredients: [],
    }));
  }

  //     // resets the query to an empty string and the ingredients to an empty array
  // function clearSearch() {
  //   setState({
  //     ...state,
  //     query: "",
  //     isHidden: false,
  //     ingredients: [],
  //   });
  // }

  // CUSTOM CSS "container" CLASS
  // <div className={styles.container}>

  // BULMA CSS "container" CLASS
  // <div className="container">

  return (
    <>
      <section class="section">
        <div className={styles["search-bar-container"]}>
          {state.selectedItems.map((item, index) => (
            <IngredientBadge
              key={index}
              item={item}
              onDeleteClick={() => handleDeleteClick(item)}
              onClick={(event) => event.stopPropagation()}
              clearSearch={clearSearch}
            />
          ))}
          <input
            ref={inputRef}
            onFocus={() =>
              setState((prevState) => ({ ...prevState, isHidden: false }))
            }
            onBlur={async () => {
              setTimeout(() => {
                setState((prevState) => ({ ...prevState, isHidden: true }));
              }, 200);
            }}
            type="text"
            className={styles.textbox}
            value={state.query}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, query: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="Search..."
          />
          <ul
            className={`${styles["options"]} ${
              !state.isHidden &
              (state.query !== "") &
              (state.ingredients.length > 0)
                ? styles["show"]
                : ""
            }`}
          >
            {state.ingredients.map((ingred, index) => (
              <li
                key={index}
                className={`${styles.option}
      ${isOptionSelected(ingred) ? styles.selected : ""}
      ${
        index === state.highlightedIndex && isOptionSelected(ingred)
          ? styles["highlight-selected"]
          : ""
      }
      ${
        index === state.highlightedIndex && !isOptionSelected(ingred)
          ? styles.highlighted
          : ""
      }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    query: ingred.suggestions,
                  }));
                  handleItemClick(ingred.suggestions);
                  setState((prevState) => ({ ...prevState, isHidden: false }));
                  clearSearch();
                }}
                onMouseEnter={() => {
                  setState((prevState) => ({
                    ...prevState,
                    highlightedIndex: index,
                  }));
                }}
              >
                {ingred}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section class="section">
        <div className="container">
          <div class="columns is-multiline is-flex-grow-1 is-justify-content-space-between">
            {state.result.map((recipe, index) => (
              <div
                // className="column is-multiline is-one-fifth"
                className="column is-multiline is-4 is-align-items-center is-justify-content-space-between"
                // className="column is-multiline is-12-mobile is-6-tablet is-4-desktop"
                key={index}
              >
                <RecipeCard
                  key={recipe.dish_id}
                  dish={recipe.dish}
                  ingredients={recipe.ingredients}
                  quantities={recipe.quantities}
                  directions={recipe.directions}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchBarWithChips;

{
  /* <div className="row columns is-multiline">
{Array.isArray(state.result) &&
  state.result.map((recipe, recipe_index) => (
    <div key={recipe_index} className="column is-2">
      <div className="card large">
        <div className="card-header">
          <span>{recipe.dish}</span>
        </div>
        <div className="card-content">
          <div className="content">
            {recipe.ingredients.map((ingredient, ingredient_index) => (
              <div key={ingredient_index}>{ingredient}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
<div className="container">
<div className={`tile is-ancestor`}>
  <div className="tile is-parent">
    {Array.isArray(state.result) &&
      state.result.map((recipe, index) => (
        // <div key={index} className="tile is-parent is-4">
        <div className={`tile is-child box`}>
          <h6>{recipe.dish}</h6>
          {recipe.ingredients.map((ingredient, i) => (
            <div
              key={i}
              className={
                styles["search-result-ingredient-list-element"]
              }
            >
              <span>{ingredient}</span>
            </div>
          ))}
        </div>
        // </div>
      ))}
  </div>
</div>
</div>
<div className={styles["search-results-container"]}>
{Array.isArray(state.result) &&
  state.result.map((recipe) => (
    <div className={styles["search-result-card"]}>
      <h6>{recipe.dish}</h6>
      <ul className={styles["search-result-ingredient-list"]}>
        {recipe.ingredients.map((ingredient, index) => (
          <li
            key={index}
            className={styles["search-result-ingredient-list-element"]}
          >
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
<div class="tile is-ancestor">
<div class="tile is-12 is-parent">
  <div class="tile">
    <div class="tile is-parent">
      <article class="tile is-child notification is-info">
        <p class="title">First tile</p>
        <p class="subtitle">With an image</p>
      </article>
    </div>
  </div>
</div>
</div> */
}
{
  /* <div className="row columns is-multiline">
  {cardData ? (
    cardData.map((card) => (
      <div key={card.id} className="column is-4">
        <div className="card large">
          <div className="card-image">
            <figure className="image is-16by9">
              <img src={card.image} alt="Image" />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img src={card.avatar} alt="Image" />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-4 no-padding">{card.user.title}</p>
                <p>
                  <span className="title is-6">
                    <a href={`http://twitter.com/${card.user.handle}`}>
                      {card.user.handle}
                    </a>
                  </span>
                </p>
                <p className="subtitle is-6">{card.user.title}</p>
              </div>
            </div>
            <div className="content">
              {card.content}
              <div className="background-icon">
                <span className="icon-twitter"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>Loading...</p>
  )}
</div>; */
}
//   <div className="container">
//   <div className={`tile is-ancestor`}>
//     <div className="tile is-parent">
//       {Array.isArray(state.result) &&
//         // Map over the array in sets of three
//         state.result.reduce((rows, recipe, index) => {
//           if (index % 3 === 0) rows.push([]);
//           rows[rows.length - 1].push(recipe);
//           return rows;
//         }, []).map((row, rowIndex) => (
//           <div key={rowIndex} className="tile is-parent">
//             {row.map((recipe, colIndex) => (
//               <div key={colIndex} className={`tile is-child box`}>
//                 <h6>{recipe.dish}</h6>
//                 {recipe.ingredients.map((ingredient, i) => (
//                   <div
//                     key={i}
//                     className={
//                       styles["search-result-ingredient-list-element"]
//                     }
//                   >
//                     <span>{ingredient}</span>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ))}
//     </div>
//   </div>
// </div>
{
  /* <div className={styles["search-results-container"]}>
<div className={styles["search-result-card"]}>
  <h6>SEARCH RESULT 1</h6>
  <ul className={styles["search-result-ingredient-list"]}>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 1</span>
    </li>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 2</span>
    </li>
  </ul>
</div>
<div className={styles["search-result-card"]}>
  <h6>SEARCH RESULT 2</h6>
  <ul className={styles["search-result-ingredient-list"]}>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 1</span>
    </li>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 2</span>
    </li>
  </ul>
</div>
<div className={styles["search-result-card"]}>
  <h6>SEARCH RESULT 3</h6>
  <ul className={styles["search-result-ingredient-list"]}>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 1</span>
    </li>
    <li className={styles["search-result-ingredient-list-element"]}>
      <span>INGREDIENT 2</span>
    </li>
  </ul>
</div>
</div> */
}
/* <div className={styles["results-container"]}>
{state.result.map((recipe) =>
  recipe.map((r, index) => <RecipeCard key={index} recipe={r} />)
)}
</div> */
//   <div className={styles["results-container"]}>
//   <RecipeCardGrid recipe={state.result} />
// </div>
// #####################################################################################
// #####################################################################################

// ####################### GOOD TO GO (Multiple state variables) #######################
// ####################### GOOD TO GO (Multiple state variables) #######################

// // // React component for the search bar with chips
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import axios from "axios";
// import styles from "./SearchBar.module.css";
// import RecipeCard from "./RecipeCard.jsx";
// import IngredientBadge from "./IngredientBadge";
// // import "dotenv/config";

// function SearchBarWithChips() {
//   const [query, setQuery] = useState("");

//   const [isHidden, setIsHidden] = useState(true);

//   const [ingredients, setIngredients] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [highlightedIndex, setHighlightedIndex] = useState(-1);

//   // save data from selected search items
//   const [result, setResult] = useState([]);

//   // ref for the input element
//   const inputRef = useRef();

//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("EXECUTING QUERY: ", query);
//           console.log("process.env: ", process.env); // remove thi
//           console.log(
//             "process.env.REACT_APP_API_URL: ",
//             process.env.REACT_APP_API_URL
//           );
//           console.log(
//             "query url: ",
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${query}&limit=5`
//           );

//           const { data } = await axios.get(
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${query}&limit=5`
//           );

//           console.log("data: ", data);
//           console.log("data['suggestions']: ", data["suggestions"]);
//           console.log("----> selected: ", ingredients);

//           // set the ingredients to the products array
//           setIngredients(data["suggestions"] || []);

//           console.log("Setting hidden to FALSE");

//           setIsHidden(false);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (query) {
//         fetchData();
//       }
//       //   fetchData();
//     },
//     2000,
//     [query]
//   );

//   useEffect(() => {
//     // const pid = selectedItems.map(
//     //   (item) =>
//     //     `${process.env.REACT_APP_API_URL}/dev/api/v1/dishes-by-ingredients/?ingredients=${item}`
//     // );
//     //   base search URL by ingredients
//     const base_url = `${process.env.REACT_APP_API_URL}/dev/api/v1/dishes-by-ingredients/?ingredients=`;

//     // join all the selected ingredients with "&" delimiter and replace spaces with +
//     const search_items = selectedItems
//       .map((str) => str.replace(/\s+/g, "+"))
//       .join("&ingredients=");

//     // url to query the API for recipes based on the selected ingredients
//     const search_url = `${base_url}${search_items}&limit=3`;
//     //   const search_url = `${process.env.REACT_APP_API_URL}/dev/api/v1/dishes-by-ingredients/?ingredients=${search_items}&limit=3`;

//     console.log("=========================");
//     console.log("==== SECOND API CALL ====");
//     console.log("selectedItems: ", selectedItems);
//     console.log("search_items: ", search_items);
//     console.log("search_url: ", search_url);
//     console.log("=========================");

//     const fetchResultsData = async (url) => {
//       try {
//         console.log("---> QUERYING search_url:\n", search_url);

//         const { data } = await axios.get(search_url);

//         console.log("result: ", result);
//         console.log("data: ", data);

//         // Update the results state with the fetched data

//         setResult((prevResults) => [...prevResults, data]);
//         // setResult(data);
//         // setResult((prevResults) => [...prevResults, ...data]);
//         console.log("=========================");
//         // set the results array to response data

//         //   setIngredients(data["products"]);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     if (selectedItems.length === 0) {
//       setResult([]);
//     }
//     if (selectedItems.length > 0) {
//       console.log("===== CLEARING RESULTS =====");
//       // Clear the previous results before making new API calls
//       setResult([]);
//       // search_url.forEach((url) => fetchResultsData(url));
//       fetchResultsData(search_url);
//       console.log("=========================");
//     }
//   }, [selectedItems]);

//   // set the highlightedIndex state value to -1 when isHidden changes
//   useEffect(() => {
//     if (isHidden) {
//       setHighlightedIndex(-1);
//     }
//   }, [isHidden]);

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();

//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex < ingredients.length - 1) {
//         setHighlightedIndex((prevIndex) => prevIndex + 1);
//         // setSelectedItem(ingredients[highlightedIndex + 1]);
//       }
//       return;
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();

//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex > 0) {
//         setHighlightedIndex((prevIndex) => prevIndex - 1);
//       }

//       // if ArrowUp is pressed and the highlightedIndex is at the begininng
//       // of the suggestion array (index == 0),
//       // then set highlightedIndex to -1 (default), allowing user to enter there custom inputs
//       if (highlightedIndex === 0) {
//         setHighlightedIndex(-1);
//         // setIsHidden(true);
//       }
//       return;
//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       // if a non empty query is given AND no suggested  ingredients are highlighted(-1 index)
//       // THEN add the query to the selectedItems list
//       if (query !== "" && highlightedIndex === -1) {
//         console.log(
//           "QUERY NOT EMPTY AND highlightedIndex  === -1, adding 'query' to selectedItems "
//         );
//         console.log("--> query: ", query);
//         console.log("--> selectedItems: ", selectedItems);

//         const updatedItems = [...selectedItems, query];

//         console.log("--> UPDATING updatedItems: ", updatedItems);
//         // setQuery(query);
//         setSelectedItems(updatedItems);
//         // setQuery("");
//         clearSearch();
//         inputRef.current.focus();
//         return;
//       }

//       // if any suggested ingredients have been
//       // put into ingredients state variable,
//       // - select the highlighted ingredient
//       // - add it to the selectedItems list
//       // - close the ingredients dropdown (set hidden to true)
//       // - clear the search bar
//       // - refocus on the search bar
//       if (ingredients.length > 0) {
//         const updatedItems = [...selectedItems, ingredients[highlightedIndex]];

//         console.log("--> UPDATING updatedItems: ", updatedItems);
//         console.log(
//           "--> SELECTING OPTION ingredients[highlightedIndex]: ",
//           ingredients[highlightedIndex]
//         );

//         setQuery(ingredients[highlightedIndex]);

//         // add the newly selected item to the selected items list
//         setSelectedItems(updatedItems);

//         // close the ingredients dropdown
//         setIsHidden(true);

//         clearSearch();
//         inputRef.current.focus();
//         return;
//       }

//       // if no suggested ingredients have been put into ingredients state variable,
//       // and a non empty string has been given, then add this to the selectedItems state list
//       if (query !== "") {
//         console.log("--> highlightedIndex  === -1: ");
//         console.log("--> query: ", query);

//         const updatedItems = [...selectedItems, query];
//         console.log("--> UPDATING updatedItems: ", updatedItems);
//         setSelectedItems(updatedItems);
//         // setQuery("");
//         clearSearch();
//         inputRef.current.focus();
//         return;
//       }
//     } else if (event.key === "Backspace" && query === "") {
//       event.preventDefault();

//       let selected_items = selectedItems;
//       console.log("------> selected_items: ", selected_items);
//       console.log("------> selected_items.length: ", selected_items.length);
//       // remove the last item from the selected items list
//       if (selected_items.length > 0) {
//         // setIsHidden(true);
//         setSelectedItems(selected_items.slice(0, -1));
//       }

//       //   if (selected_items.length === 0) {
//       //     setIsHidden(false);
//       //   }
//       // refocus on the input
//       inputRef.current.focus();

//       //   setIsHidden(true);
//       return;
//     }
//   }
//   // handle when a suggested ingredient is clicked from the suggested ingredients dropdown
//   function handleItemClick(item) {
//     console.log("handleItemClick CLICKED");
//     console.log("----> item: ", item);
//     const updatedItems = [...selectedItems, ingredients[highlightedIndex]];
//     console.log("--->handleItemClick updatedItems: ", updatedItems);
//     console.log(
//       "--->handleItemClick ingredients[highlightedIndex].title: ",
//       ingredients[highlightedIndex].title
//     );

//     setSelectedItems(updatedItems);

//     clearSearch();
//     inputRef.current.focus(); // Refocus on the input
//   }

//   // handle when the remove button is clicked on one of the IngredientBadge components
//   function handleDeleteClick(toBeRemoved) {
//     console.log("DELETE CLICKED");
//     console.log("----> toBeRemoved: ", toBeRemoved);

//     const newSelectedItems = selectedItems.filter(
//       (item) => item !== toBeRemoved
//     );
//     setIsHidden(true);
//     setSelectedItems(newSelectedItems);
//     // inputRef.current.focus(); // Refocus on the input
//   }

//   function isOptionSelected(option) {
//     // console.log("isOptionSelected option: ", option);
//     // console.log("isOptionSelected query: ", query);
//     // console.log("isOptionSelected option === query: ", option === query);
//     // return option.title === query;
//     return option === query;
//   }
//   // resets the query to an empty string and the ingredients to an empty array
//   function clearSearch() {
//     setQuery("");
//     // setIsHidden(false);
//     setIngredients([]);
//   }

//   return (
//     <>
//       <div
//         className={styles.container}
//         // onFocus={() => setIsHidden(false)}
//         // onBlur={() => setIsHidden(true)}
//       >
//         {selectedItems.map((item, index) => (
//           <IngredientBadge
//             key={index}
//             item={item}
//             onDeleteClick={() => handleDeleteClick(item)}
//             onClick={(event) => event.stopPropagation()}
//             clearSearch={clearSearch}
//           />
//         ))}
//         <input
//           ref={inputRef}
//           onFocus={() => setIsHidden(false)}
//           onBlur={async () => {
//             setTimeout(() => {
//               setIsHidden(true);
//             }, 200);
//           }}
//           //   onBlur={() => setIsHidden(true)}
//           type="text"
//           //   autoFocus
//           className={styles.textbox}
//           value={query}
//           // onClick={() => setIsHidden((prev) => !prev)}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search..."
//         />
//         <ul
//           className={`${styles["options"]} ${
//             !isHidden & (query !== "") & (ingredients.length > 0)
//               ? styles["show"]
//               : ""
//           }`}
//         >
//           {ingredients.map((ingred, index) => (
//             <li
//               key={index}
//               className={`${styles.option}
//       ${isOptionSelected(ingred) ? styles.selected : ""}
//       ${
//         index === highlightedIndex && isOptionSelected(ingred)
//           ? styles["highlight-selected"]
//           : ""
//       }
//       ${
//         index === highlightedIndex && !isOptionSelected(ingred)
//           ? styles.highlighted
//           : ""
//       }`}
//               onClick={(e) => {
//                 // e.stopPropagation();
//                 // selectOption(ingred.suggestions);
//                 setQuery(ingred.suggestions);
//                 handleItemClick(ingred.suggestions);
//                 setIsHidden(false);
//                 clearSearch();
//               }}
//               onMouseEnter={() => {
//                 console.log("MOUSE ENTERED");
//                 setHighlightedIndex(index);
//               }}
//             >
//               {ingred}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <br></br>
//     </>
//   );
// }

// export default SearchBarWithChips;

// #####################################################################################
// #####################################################################################

// // ###############################################

// // React component for the search bar with chips
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import axios from "axios";
// import styles from "./SearchBar.module.css";
// import RecipeCard from "./RecipeCard.jsx";

// function SearchBarWithChips() {
//   const [query, setQuery] = useState("");

//   const [isHidden, setIsHidden] = useState(true);

//   const [ingredients, setIngredients] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [highlightedIndex, setHighlightedIndex] = useState(0);

//   // save data from selected search items
//   const [result, setResult] = useState([]);

//   // ref for the input element
//   const inputRef = useRef();

//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("EXECUTING QUERY: ", query);
//           console.log(
//             "query url: ",
//             //   `https://dummyjson.com/products/search?q=${query}&limit=3`
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${query}&limit=3`
//             // `http://127.0.0.1:8000/api/v1/suggested-ingredients/?search=${query}`
//           );

//           const { data } = await axios.get(
//             //   `https://dummyjson.com/products/search?q=${query}&limit=3`
//             // http://127.0.0.1:8000/api/v1/suggested-ingredients/?search=chi
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${query}&limit=3`
//             // `http://127.0.0.1:8000/api/v1/suggested-ingredients/?search=${query}`
//             // { crossdomain: true }
//           );
//           //   console.log("response: ", response);
//           console.log("data: ", data);
//           console.log("data['suggestions']: ", data["suggestions"]);

//           // set the ingredients to the products array
//           setIngredients(data["suggestions"] || []);
//           //   setIngredients(data || []);
//           //   setIngredients(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (query) {
//         fetchData();
//       }
//       //   fetchData();
//     },
//     200,
//     [query]
//   );

//   //   useEffect(() => {
//   //     const pid = selectedItems.map(
//   //       (item) => `https://dummyjson.com/products/category/${item.category}`
//   //     );
//   //     console.log("=========================");
//   //     console.log("==== SECOND API CALL ====");
//   //     console.log("selectedItems: ", selectedItems);
//   //     console.log("pid: ", pid);

//   //     const fetchResultsData = async (url) => {
//   //       try {
//   //         console.log("---> QUERYING url:\n", url);

//   //         const { data } = await axios.get(url);

//   //         console.log("result: ", result);
//   //         console.log("data: ", data);

//   //         console.log("data['products']: ", data["products"]);
//   //         // const updatedItems = [...selectedItems, data];
//   //         // console.log("SECOND API CALL updatedItems: ", updatedItems);

//   //         // Update the results state with the fetched data
//   //         setResult((prevResults) => [...prevResults, ...data["products"]]);
//   //         // setResult((prevResults) => [...prevResults, data]);
//   //         console.log("=========================");
//   //         // set the results array to response data

//   //         //   setIngredients(data["products"]);
//   //       } catch (error) {
//   //         console.log(error);
//   //       }
//   //     };
//   //     if (pid.length === 0) {
//   //       setResult([]);
//   //     }
//   //     if (pid.length > 0) {
//   //       // Clear the previous results before making new API calls
//   //       setResult([]);
//   //       pid.forEach((url) => fetchResultsData(url));
//   //     }
//   //   }, [selectedItems]);

//   useEffect(() => {
//     if (isHidden) {
//       setHighlightedIndex(0);
//     }
//   }, [isHidden]);

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();

//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex < ingredients.length - 1) {
//         setHighlightedIndex((prevIndex) => prevIndex + 1);
//         // setSelectedItem(ingredients[highlightedIndex + 1]);
//       }
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();

//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex > 0) {
//         setHighlightedIndex((prevIndex) => prevIndex - 1);
//       }

//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       console.log("--> UPDATING selectedItems: ", selectedItems);

//       const updatedItems = [...selectedItems, ingredients[highlightedIndex]];

//       console.log("--> UPDATING updatedItems: ", updatedItems);
//       console.log(
//         "--> SELECTING OPTION ingredients[highlightedIndex]: ",
//         ingredients[highlightedIndex]
//       );

//       //   selectOption(ingredients[highlightedIndex].title);

//       setQuery(ingredients[highlightedIndex]);

//       // add the newly selected item to the selected items list
//       setSelectedItems(updatedItems);

//       // close the ingredients dropdown
//       setIsHidden(true);

//       clearSearch();
//       inputRef.current.focus();
//     } else if (event.key === "Backspace" && query === "") {
//       event.preventDefault();
//       console.log("BACKSPACE CLICKED");
//       console.log("---> event: ", event);
//       console.log("----> query: ", query);

//       let selected_items = selectedItems;
//       console.log("------> selected_items: ", selected_items);
//       console.log("------> selected_items.length: ", selected_items.length);
//       // remove the last item from the selected items list
//       if (selected_items.length > 0) {
//         // setIsHidden(true);
//         setSelectedItems(selected_items.slice(0, -1));
//       }

//       //   if (selected_items.length === 0) {
//       //     setIsHidden(false);
//       //   }
//       // refocus on the input
//       inputRef.current.focus();

//       //   setIsHidden(true);
//     }
//   }

//   function handleItemClick(item) {
//     console.log("handleItemClick CLICKED");
//     console.log("----> item: ", item);
//     const updatedItems = [...selectedItems, ingredients[highlightedIndex]];
//     console.log("--->handleItemClick updatedItems: ", updatedItems);

//     setSelectedItems(updatedItems);
//     // selectOption(ingredients[highlightedIndex].title);
//     setQuery(ingredients[highlightedIndex].title);
//     clearSearch();
//     inputRef.current.focus(); // Refocus on the input
//   }

//   function handleDeleteClick(toBeRemoved) {
//     console.log("DELETE CLICKED");
//     console.log("----> toBeRemoved: ", toBeRemoved);

//     const newSelectedItems = selectedItems.filter(
//       (item) => item !== toBeRemoved
//     );
//     setIsHidden(true);
//     setSelectedItems(newSelectedItems);
//     // inputRef.current.focus(); // Refocus on the input
//   }

//   function selectOption(option) {
//     setQuery(option);
//   }

//   function isOptionSelected(option) {
//     return option.title === query;
//   }

//   function clearSearch() {
//     setQuery("");
//     // setIsHidden(false);
//     setIngredients([]);
//   }

//   // <button onClick={() => handleDeleteClick(item)}>&times;</button>
//   // onBlur={async () => {
//   //   setTimeout(() => {
//   //     setIsHidden(true);
//   //   }, 200);
//   // }}
//   // onBlur={() => {setIsHidden(true)}

//   return (
//     <>
//       <div
//         className={styles.container}
//         // onFocus={() => setIsHidden(false)}
//         // onBlur={() => setIsHidden(true)}
//       >
//         {selectedItems.map((item) => (
//           <div className={styles["ingredient-badge"]}>
//             <span>{item}</span>
//             <button
//               onClick={(event) => {
//                 event.stopPropagation();
//                 handleDeleteClick(item);
//                 clearSearch();
//               }}
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//         <input
//           ref={inputRef}
//           onFocus={() => setIsHidden(false)}
//           onBlur={async () => {
//             setTimeout(() => {
//               setIsHidden(true);
//             }, 200);
//           }}
//           //   onBlur={() => setIsHidden(true)}
//           type="text"
//           //   autoFocus
//           className={styles.textbox}
//           value={query}
//           // onClick={() => setIsHidden((prev) => !prev)}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search..."
//         />
//         <ul
//           className={`${styles["options"]} ${!isHidden ? styles["show"] : ""}`}
//         >
//           {ingredients.map((ingred, index) => (
//             <li
//               key={index}
//               className={`${styles.option}
//             ${isOptionSelected(ingred) ? styles.selected : ""}
//             ${index === highlightedIndex ? styles.highlighted : ""}`}
//               onClick={(e) => {
//                 // e.stopPropagation();
//                 // selectOption(ingred.suggestions);
//                 setQuery(ingred.suggestions);
//                 handleItemClick(ingred.suggestions);
//                 setIsHidden(false);
//                 clearSearch();
//               }}
//               onMouseEnter={() => {
//                 console.log("MOUSE ENTERED");
//                 setHighlightedIndex(index);
//               }}
//             >
//               {ingred}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <br></br>
//     </>
//   );

//   // THIS CODE BELOW GOES AFTER THE <br></br> and before the end of fragment
//   //   <br></br>
//   //   <div className={styles["results-container"]}>
//   //   {result.map((item) => (
//   //     // Render the results from the second API call
//   //     <div key={item.id} className={styles["recipe-card"]}>
//   //       <h5>{item.suggestions}</h5>
//   //       <h1>{`${item.suggestions}`}</h1>

//   //       {/* <img src={item.thumbnail} alt={item.thumbnail} />
//   //       <h4>{`Description: ${item.description}`}</h4>
//   //       <h4>{`Price: ${item.price}`}</h4> */}
//   //     </div>
//   //   ))}
//   // </div>
//   // {secondApiResults.map((item) => (
//   //   // Render the results from the second API call
//   //   <div key={item.id} className={styles["recipe-card"]}>
//   //     <h1>{item.title}</h1>
//   //     <h2>{item.description}</h2>
//   //     <h2>{item.price}</h2>
//   //   </div>
//   // ))}

//   /* {selectedItems.map((item) => (
//           <>
//             <div className={styles["recipe-card"]}>
//               <h1>{item.title}</h1>
//               <h2>{item.description}</h2>
//               <h2>{item.price}</h2>
//             </div>
//           </>
//         ))} */
//   //   </div>
//   //   {result.map((item) => (
//   //     <>
//   //       <div className={styles["recipe-card"]}>
//   //         <h1>{item.title}</h1>
//   //         <h2>{item.description}</h2>
//   //         <h2>{item.price}</h2>
//   //       </div>
//   //     </>
//   //   ))}
// }

// export default SearchBarWithChips;

// // // ###############################################
// // ################# COMPUTER API ################
// // ###############################################
// // React component for the search bar with chips
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import axios from "axios";
// import styles from "./SearchBar.module.css";
// import RecipeCard from "./RecipeCard.jsx";

// function SearchBarWithChips() {
//   const [query, setQuery] = useState("");

//   const [isHidden, setIsHidden] = useState(true);

//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [highlightedIndex, setHighlightedIndex] = useState(0);

//   // save data from selected search items
//   const [result, setResult] = useState([]);

//   // ref for the input element
//   const inputRef = useRef();

//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("EXECUTING QUERY: ", query);
//           console.log(
//             "query url: ",
//             `https://dummyjson.com/products/search?q=${query}&limit=3`
//           );

//           const { data } = await axios.get(
//             `https://dummyjson.com/products/search?q=${query}&limit=3`
//           );
//           //   console.log("response: ", response);
//           console.log("data: ", data);
//           console.log("data['products']: ", data["products"]);

//           // set the suggestions to the products array
//           setSuggestions(data["products"] || []);
//           //   setSuggestions(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (query) {
//         fetchData();
//       }
//       //   fetchData();
//     },
//     1000,
//     [query]
//   );

//   useEffect(() => {
//     const pid = selectedItems.map(
//       (item) => `https://dummyjson.com/products/category/${item.category}`
//     );
//     console.log("=========================");
//     console.log("==== SECOND API CALL ====");
//     console.log("selectedItems: ", selectedItems);
//     console.log("pid: ", pid);

//     const fetchResultsData = async (url) => {
//       try {
//         console.log("---> QUERYING url:\n", url);

//         const { data } = await axios.get(url);

//         console.log("result: ", result);
//         console.log("data: ", data);

//         console.log("data['products']: ", data["products"]);
//         // const updatedItems = [...selectedItems, data];
//         // console.log("SECOND API CALL updatedItems: ", updatedItems);

//         // Update the results state with the fetched data
//         setResult((prevResults) => [...prevResults, ...data["products"]]);
//         // setResult((prevResults) => [...prevResults, data]);
//         console.log("=========================");
//         // set the results array to response data

//         //   setSuggestions(data["products"]);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     if (pid.length === 0) {
//       setResult([]);
//     }
//     if (pid.length > 0) {
//       // Clear the previous results before making new API calls
//       setResult([]);
//       pid.forEach((url) => fetchResultsData(url));
//     }
//   }, [selectedItems]);

//   useEffect(() => {
//     if (isHidden) {
//       setHighlightedIndex(0);
//     }
//   }, [isHidden]);

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();

//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex < suggestions.length - 1) {
//         setHighlightedIndex((prevIndex) => prevIndex + 1);
//         // setSelectedItem(suggestions[highlightedIndex + 1]);
//       }
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();

//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex > 0) {
//         setHighlightedIndex((prevIndex) => prevIndex - 1);
//       }

//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       console.log("--> UPDATING selectedItems: ", selectedItems);
//       const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
//       console.log("--> UPDATING updatedItems: ", updatedItems);
//       console.log(
//         "--> SELECTING OPTION suggestions[highlightedIndex].title: ",
//         suggestions[highlightedIndex].title
//       );

//       selectOption(suggestions[highlightedIndex].title);

//       // add the newly selected item to the selected items list
//       setSelectedItems(updatedItems);

//       // close the suggestion dropdown
//       setIsHidden(true);

//       clearSearch();
//       inputRef.current.focus();
//     } else if (event.key === "Backspace" && query === "") {
//       event.preventDefault();
//       console.log("BACKSPACE CLICKED");
//       console.log("---> event: ", event);
//       console.log("----> query: ", query);

//       let selected_items = selectedItems;
//       console.log("------> selected_items: ", selected_items);
//       console.log("------> selected_items.length: ", selected_items.length);
//       // remove the last item from the selected items list
//       if (selected_items.length > 0) {
//         // setIsHidden(true);
//         setSelectedItems(selected_items.slice(0, -1));
//       }

//       //   if (selected_items.length === 0) {
//       //     setIsHidden(false);
//       //   }
//       // refocus on the input
//       inputRef.current.focus();

//       //   setIsHidden(true);
//     }
//   }

//   function handleItemClick(item) {
//     console.log("handleItemClick CLICKED");
//     console.log("----> item: ", item);
//     const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
//     console.log("--->handleItemClick updatedItems: ", updatedItems);
//     setSelectedItems(updatedItems);
//     selectOption(suggestions[highlightedIndex].title);
//     clearSearch();
//     inputRef.current.focus(); // Refocus on the input
//   }

//   function handleDeleteClick(toBeRemoved) {
//     console.log("DELETE CLICKED");
//     console.log("----> toBeRemoved: ", toBeRemoved);

//     const newSelectedItems = selectedItems.filter(
//       (item) => item !== toBeRemoved
//     );
//     setIsHidden(true);
//     setSelectedItems(newSelectedItems);
//     // inputRef.current.focus(); // Refocus on the input
//   }

//   function selectOption(option) {
//     setQuery(option);
//   }

//   function isOptionSelected(option) {
//     return option.title === query;
//   }

//   function clearSearch() {
//     setQuery("");
//     setIsHidden(false);
//     setSuggestions([]);
//   }

//   // <button onClick={() => handleDeleteClick(item)}>&times;</button>
//   // onBlur={async () => {
//   //   setTimeout(() => {
//   //     setIsHidden(true);
//   //   }, 200);
//   // }}
//   // onBlur={() => {setIsHidden(true)}

//   return (
//     <>
//       <div
//         className={styles.container}
//         // onFocus={() => setIsHidden(false)}
//         // onBlur={() => setIsHidden(true)}
//       >
//         {selectedItems.map((item) => (
//           <div className={styles["ingredient-badge"]}>
//             <span>{item.title}</span>
//             <button
//               onClick={(event) => {
//                 event.stopPropagation();
//                 handleDeleteClick(item);
//                 clearSearch();
//               }}
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//         <input
//           ref={inputRef}
//           onFocus={() => setIsHidden(false)}
//           onBlur={async () => {
//             setTimeout(() => {
//               setIsHidden(true);
//             }, 200);
//           }}
//           //   onBlur={() => setIsHidden(true)}
//           type="text"
//           //   autoFocus
//           className={styles.textbox}
//           value={query}
//           // onClick={() => setIsHidden((prev) => !prev)}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search..."
//         />
//         <ul
//           className={`${styles["options"]} ${!isHidden ? styles["show"] : ""}`}
//         >
//           {suggestions.map((suggest, index) => (
//             <li
//               key={index}
//               className={`${styles.option}
//             ${isOptionSelected(suggest) ? styles.selected : ""}
//             ${index === highlightedIndex ? styles.highlighted : ""}`}
//               onClick={(e) => {
//                 // e.stopPropagation();
//                 selectOption(suggest.title);
//                 handleItemClick(suggest.title);
//                 setIsHidden(false);
//                 clearSearch();
//               }}
//               onMouseEnter={() => {
//                 console.log("MOUSE ENTERED");
//                 setHighlightedIndex(index);
//               }}
//             >
//               {suggest.title}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <br></br>
//       <div className={styles["results-container"]}>
//         {result.map((item) => (
//           // Render the results from the second API call
//           <div key={item.id} className={styles["recipe-card"]}>
//             <h5>{item.title}</h5>
//             <h1>{`${item.title} : ${item.category}`}</h1>

//             <img src={item.thumbnail} alt={item.thumbnail} />
//             <h4>{`Description: ${item.description}`}</h4>
//             <h4>{`Price: ${item.price}`}</h4>
//           </div>
//         ))}
//       </div>
//     </>
//   );

//   // {secondApiResults.map((item) => (
//   //   // Render the results from the second API call
//   //   <div key={item.id} className={styles["recipe-card"]}>
//   //     <h1>{item.title}</h1>
//   //     <h2>{item.description}</h2>
//   //     <h2>{item.price}</h2>
//   //   </div>
//   // ))}

//   /* {selectedItems.map((item) => (
//           <>
//             <div className={styles["recipe-card"]}>
//               <h1>{item.title}</h1>
//               <h2>{item.description}</h2>
//               <h2>{item.price}</h2>
//             </div>
//           </>
//         ))} */
//   //   </div>
//   //   {result.map((item) => (
//   //     <>
//   //       <div className={styles["recipe-card"]}>
//   //         <h1>{item.title}</h1>
//   //         <h2>{item.description}</h2>
//   //         <h2>{item.price}</h2>
//   //       </div>
//   //     </>
//   //   ))}
// }

// export default SearchBarWithChips;

// #########################################################
// #########################################################
// // React component for the search bar with chips
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import axios from "axios";
// import styles from "./SearchBar.module.css";
// import RecipeCard from "./RecipeCard.jsx";

// function SearchBarWithChips() {
//   const [query, setQuery] = useState("");

//   const [isHidden, setIsHidden] = useState(true);

//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [highlightedIndex, setHighlightedIndex] = useState(0);

//   // save data from selected search items
//   const [result, setResult] = useState([]);

//   // ref for the input element
//   const inputRef = useRef();

//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("EXECUTING QUERY: ", query);
//           console.log(
//             "query url: ",
//             `https://dummyjson.com/products/search?q=${query}&limit=3`
//           );

//           const { data } = await axios.get(
//             `https://dummyjson.com/products/search?q=${query}&limit=3`
//           );
//           //   console.log("response: ", response);
//           console.log("data: ", data);
//           console.log("data['products']: ", data["products"]);

//           // set the suggestions to the products array
//           setSuggestions(data["products"] || []);
//           //   setSuggestions(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (query) {
//         fetchData();
//       }
//       //   fetchData();
//     },
//     1000,
//     [query]
//   );

//   useEffect(() => {
//     const pid = selectedItems.map(
//       (item) => `https://dummyjson.com/products/${item.id}`
//     );
//     console.log("=========================");
//     console.log("==== SECOND API CALL ====");
//     console.log("selectedItems: ", selectedItems);
//     console.log("pid: ", pid);

//     const fetchResultsData = async (url) => {
//       try {
//         console.log("---> QUERYING url:\n", url);

//         const { data } = await axios.get(url);

//         console.log("result: ", result);
//         console.log("data: ", data);
//         // const updatedItems = [...selectedItems, data];
//         // console.log("SECOND API CALL updatedItems: ", updatedItems);

//         // Update the results state with the fetched data
//         setResult((prevResults) => [...prevResults, data]);
//         console.log("=========================");
//         // set the results array to response data

//         //   setSuggestions(data["products"]);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     if (pid.length === 0) {
//       setResult([]);
//     }
//     if (pid.length > 0) {
//       // Clear the previous results before making new API calls
//       setResult([]);
//       pid.forEach((url) => fetchResultsData(url));
//     }
//   }, [selectedItems]);

//   useEffect(() => {
//     if (isHidden) {
//       setHighlightedIndex(0);
//     }
//   }, [isHidden]);

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();

//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex < suggestions.length - 1) {
//         setHighlightedIndex((prevIndex) => prevIndex + 1);
//         // setSelectedItem(suggestions[highlightedIndex + 1]);
//       }
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();

//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (highlightedIndex > 0) {
//         setHighlightedIndex((prevIndex) => prevIndex - 1);
//       }

//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       console.log("--> UPDATING selectedItems: ", selectedItems);
//       const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
//       console.log("--> UPDATING updatedItems: ", updatedItems);
//       console.log(
//         "--> SELECTING OPTION suggestions[highlightedIndex].title: ",
//         suggestions[highlightedIndex].title
//       );

//       selectOption(suggestions[highlightedIndex].title);

//       // add the newly selected item to the selected items list
//       setSelectedItems(updatedItems);

//       // close the suggestion dropdown
//       setIsHidden(true);

//       clearSearch();
//       inputRef.current.focus();
//     } else if (event.key === "Backspace" && query === "") {
//       event.preventDefault();
//       console.log("BACKSPACE CLICKED");
//       console.log("---> event: ", event);
//       console.log("----> query: ", query);

//       let selected_items = selectedItems;
//       console.log("------> selected_items: ", selected_items);
//       console.log("------> selected_items.length: ", selected_items.length);
//       // remove the last item from the selected items list
//       if (selected_items.length > 0) {
//         // setIsHidden(true);
//         setSelectedItems(selected_items.slice(0, -1));
//       }

//       //   if (selected_items.length === 0) {
//       //     setIsHidden(false);
//       //   }
//       // refocus on the input
//       inputRef.current.focus();

//       //   setIsHidden(true);
//     }
//   }

//   function handleItemClick(item) {
//     console.log("handleItemClick CLICKED");
//     console.log("----> item: ", item);
//     const updatedItems = [...selectedItems, suggestions[highlightedIndex]];
//     console.log("--->handleItemClick updatedItems: ", updatedItems);
//     setSelectedItems(updatedItems);
//     selectOption(suggestions[highlightedIndex].title);
//     clearSearch();
//     inputRef.current.focus(); // Refocus on the input
//   }

//   function handleDeleteClick(toBeRemoved) {
//     console.log("DELETE CLICKED");
//     console.log("----> toBeRemoved: ", toBeRemoved);

//     const newSelectedItems = selectedItems.filter(
//       (item) => item !== toBeRemoved
//     );
//     setIsHidden(true);
//     setSelectedItems(newSelectedItems);
//     // inputRef.current.focus(); // Refocus on the input
//   }

//   function selectOption(option) {
//     setQuery(option);
//   }

//   function isOptionSelected(option) {
//     return option.title === query;
//   }

//   function clearSearch() {
//     setQuery("");
//     setIsHidden(false);
//     setSuggestions([]);
//   }

//   // <button onClick={() => handleDeleteClick(item)}>&times;</button>
//   // onBlur={async () => {
//   //   setTimeout(() => {
//   //     setIsHidden(true);
//   //   }, 200);
//   // }}
//   // onBlur={() => {setIsHidden(true)}

//   return (
//     <>
//       <div
//         className={styles.container}
//         // onFocus={() => setIsHidden(false)}
//         // onBlur={() => setIsHidden(true)}
//       >
//         {selectedItems.map((item) => (
//           <div className={styles["ingredient-badge"]}>
//             <span>{item.title}</span>
//             <button
//               onClick={(event) => {
//                 event.stopPropagation();
//                 handleDeleteClick(item);
//                 clearSearch();
//               }}
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//         <input
//           ref={inputRef}
//           onFocus={() => setIsHidden(false)}
//           onBlur={async () => {
//             setTimeout(() => {
//               setIsHidden(true);
//             }, 200);
//           }}
//           //   onBlur={() => setIsHidden(true)}
//           type="text"
//           //   autoFocus
//           className={styles.textbox}
//           value={query}
//           // onClick={() => setIsHidden((prev) => !prev)}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Search..."
//         />
//         <ul
//           className={`${styles["options"]} ${!isHidden ? styles["show"] : ""}`}
//         >
//           {suggestions.map((suggest, index) => (
//             <li
//               key={index}
//               className={`${styles.option}
//             ${isOptionSelected(suggest) ? styles.selected : ""}
//             ${index === highlightedIndex ? styles.highlighted : ""}`}
//               onClick={(e) => {
//                 // e.stopPropagation();
//                 selectOption(suggest.title);
//                 handleItemClick(suggest.title);
//                 setIsHidden(false);
//                 clearSearch();
//               }}
//               onMouseEnter={() => {
//                 console.log("MOUSE ENTERED");
//                 setHighlightedIndex(index);
//               }}
//             >
//               {suggest.title}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <br></br>
//       <div className={styles["results-container"]}>
//         {result.map((item) => (
//           // Render the results from the second API call
//           <div key={item.id} className={styles["recipe-card"]}>
//             <h1>{item.title}</h1>

//             <img src={item.thumbnail} alt={item.thumbnail} />
//             <h4>{`Description: ${item.description}`}</h4>
//             <h4>{`Price: ${item.price}`}</h4>
//           </div>
//         ))}
//       </div>
//     </>
//   );

//   // {secondApiResults.map((item) => (
//   //   // Render the results from the second API call
//   //   <div key={item.id} className={styles["recipe-card"]}>
//   //     <h1>{item.title}</h1>
//   //     <h2>{item.description}</h2>
//   //     <h2>{item.price}</h2>
//   //   </div>
//   // ))}

//   /* {selectedItems.map((item) => (
//           <>
//             <div className={styles["recipe-card"]}>
//               <h1>{item.title}</h1>
//               <h2>{item.description}</h2>
//               <h2>{item.price}</h2>
//             </div>
//           </>
//         ))} */
//   //   </div>
//   //   {result.map((item) => (
//   //     <>
//   //       <div className={styles["recipe-card"]}>
//   //         <h1>{item.title}</h1>
//   //         <h2>{item.description}</h2>
//   //         <h2>{item.price}</h2>
//   //       </div>
//   //     </>
//   //   ))}
// }

// export default SearchBarWithChips;
// #########################################################
// #########################################################

//   useDebounce(
//     () => {
//       const pid = selectedItems.map(
//         (item) => `https://dummyjson.com/products/${item.id}`
//       );

//       console.log("selectedItems: ", selectedItems);
//       console.log("pid: ", pid);

//       const fetchResultsData = async (url) => {
//         try {
//           console.log("url: ", url);

//           const { data } = await axios.get(url);

//           console.log("result: ", result);
//           console.log("data: ", data);

//           // set the results array to response data
//           setResult(data);

//           //   setSuggestions(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (pid) {
//         pid.map((url) => fetchResultsData(url));
//       }
//     },
//     1000,
//     [selectedItems]
//   );
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
// function useGetProductsByIds(product_id, dependencyVariable, setFn) {
//   useDebounce(
//     () => {
//       const fetchResultsData = async () => {
//         try {
//           console.log("Looking up product product_id: ", product_id);
//           console.log(
//             "product product_id url: ",
//             `https://dummyjson.com/products/${product_id}`
//           );

//           const { data } = await axios.get(
//             `https://dummyjson.com/products/${product_id}`
//           );

//           //   console.log("result: ", result);
//           console.log("data: ", data);
//           // console.log("data['products']: ", data["products"]);

//           // set the results array to response data
//           setFn(data);

//           //   setSuggestions(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (product_id) {
//         fetchResultsData();
//       }
//     },
//     1000,
//     [dependencyVariable]
//   );
// }
