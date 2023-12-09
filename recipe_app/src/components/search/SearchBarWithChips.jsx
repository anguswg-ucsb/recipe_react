///////////////////////////////////////
///////////////////////////////////////

// ####################### GOOD TO GO (Single state object) #######################
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Transition } from "@headlessui/react";

import axios from "axios";

import IngredientBadge from "./IngredientBadge";
// import RecipeCard from "./RecipeCard";
import CardContainer from "./CardContainer";
import RecipePill from "./RecipePill";
import PillContainer from "./PillContainer";

// import RecipeCardGrid from "./RecipeCardGrid";
// import ResultGrid from "./ResultGrid";

function SearchBarWithChips() {
  const [state, setState] = useState({
    query: "",
    isHidden: true,
    ingredients: [],
    selectedItems: [],
    highlightedIndex: -1,
    result: [],
    isCardContainerOpen: false,
    matchCount: 0,
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
    200,
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
    const search_url = `${base_url}${search_items}&limit=8`;

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

      // setState(state.result && state.result.length > 0);
      fetchResultsData(search_url);

      console.log("=========================");
    }
  }, [state.selectedItems]);

  // When result state changes, update the isCardContainerOpen state boolean to determine
  // whether to show the CardContainer or not
  useEffect(() => {
    // Update isCardContainerOpen based on the result
    const updateIsOpen = state.result && state.result.length > 0;

    console.log("~~~~~~~~~~~~~~~~~~~");
    console.log("!!!!! updateIsOpen: ", updateIsOpen, " !!!!!");
    console.log("~~~~~~~~~~~~~~~~~~~");

    setState((prevState) => ({
      ...prevState,
      isCardContainerOpen: updateIsOpen,
    }));
  }, [state.result]);

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
      event.preventDefault();

      if (state.query !== "") {
        const matchingIngredient = state.ingredients.find(
          (ingredient) => ingredient.suggestions === state.query
        );

        if (matchingIngredient) {
          // const exactMatchIndex = state.ingredients.findIndex(
          //   (ingredient) => ingredient.suggestions === state.query
          // );
          // // setIsExactMatch(true); // Set isExactMatch to true for exact matches
          // setState((prevState) => ({
          //   ...prevState,
          //   highlightedIndex: exactMatchIndex,
          // }));

          // handleItemClick(matchingIngredient.suggestions);

          const updatedItems = [
            ...state.selectedItems,
            state.ingredients[state.highlightedIndex],
          ];
          console.log("---> MATCHING INGREDIENT SELECTION: ", updatedItems);
          // console.log(
          //   "--->handleItemClick ingredients[highlightedIndex].title: ",
          //   state.ingredients[state.highlightedIndex].title
          // );

          setState((prevState) => ({
            ...prevState,
            selectedItems: updatedItems,
          }));

          clearSearch();
          inputRef.current.focus(); // Refocus on the input
        } else {
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

          // // setIsExactMatch(false); // Set isExactMatch to false for custom inputs
          // const updatedItems = [...state.selectedItems, state.query];
          // setState((prevState) => ({
          //   ...prevState,
          //   selectedItems: updatedItems,
          // }));
          // clearSearch();
          // inputRef.current.focus();
        }
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
    // console.log(
    //   "--->handleItemClick ingredients[highlightedIndex].title: ",
    //   state.ingredients[state.highlightedIndex].title
    // );

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
      highlightedIndex: -1,
      ingredients: [],
    }));
  }

  function matchIngredients(recipes, chosen) {
    let matches = [];

    recipes.forEach((recipe, index) => {
      // console.log("recipe[ingreds]: ", recipe["ingredients"], "\n================");

      let recipe_matches = {
        count: 0,
        total_ingredients: recipe["ingredients"].length,
        percent_match: 0,
        matched_ingredients: [],
      };

      chosen.forEach((item) => {
        // console.log("item: ", item);
        if (recipe["ingredients"].includes(item)) {
          // console.log("FOUND A MATCH: ", item);
          recipe_matches.count++;
          recipe_matches.percent_match =
            recipe_matches.count / recipe_matches.total_ingredients;
          recipe_matches.matched_ingredients.push(item);
        }
      });

      matches.push(recipe_matches);
    });

    return matches;
  }
  // let search_grid_style = "grid grid-cols-6 shadow-lg overflow-hidden";

  return (
    <>
      <div class="relative">
        {/* <div className="fixed z-10 flex justify-center"> */}
        <div className="relative flex justify-center">
          <div
            // ref={inputRef}
            // tabIndex={0}
            className="relative flex flex-wrap items-center justify-center gap-1 w-80 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {state.selectedItems.map((item, index) => (
              <IngredientBadge
                key={`${item}_${index}`}
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
              // className={styles.textbox}
              className="flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 box-border"
              value={state.query}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  query: e.target.value,
                }))
              }
              onKeyDown={handleKeyDown}
              placeholder="Search..."
            />
            <ul
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
                `}
                  // className={`${styles.option} ${
                  //   isOptionSelected(option) ? styles.selected : ""
                  // } ${index === highlightedIndex ? styles.highlighted : ""}`}
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      query: ingred.suggestions,
                    }));
                    handleItemClick(ingred.suggestions);
                    // setState((prevState) => ({ ...prevState, isHidden: false }));
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
        </div>
        <div className="flex justify-center">
          <PillContainer
            result={state.result}
            selected_items={state.selectedItems}
            isOpen={state.isCardContainerOpen}
          />
        </div>
      </div>
    </>
  );
}

export default SearchBarWithChips;

///////////////////////////////////////
///////////////////////////////////////

///////////////////////////////////////
///////////////////////////////////////

// // ####################### GOOD TO GO (Single state object) #######################
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import { Transition } from "@headlessui/react";

// import axios from "axios";

// // styling
// import "bulma/css/bulma.min.css"; // Import Bulma styles
// import styles from "./SearchBar.module.css";

// import IngredientBadge from "./IngredientBadge";
// // import RecipeCard from "./RecipeCard";
// import CardContainer from "./CardContainer";
// // import TempTransition from "./TempTransition";

// // import RecipeCardGrid from "./RecipeCardGrid";
// // import ResultGrid from "./ResultGrid";

// // import "./SearchBar.scss";

// // let recipe_data = [
// //   {
// //     dish_id: 1,
// //     dish: "Chicken Parmesan",
// //     ingredients: ["chicken", "tomato sauce", "mozzarella cheese"],
// //     quantities: ["1", "1 cup", "1 cup"],
// //     directions: ["step 1", "step 2", "step 3"],
// //   },
// //   {
// //     dish_id: 2,
// //     dish: "Chicken Marsala",
// //     ingredients: ["chicken", "marsala wine", "mushrooms"],
// //     quantities: ["1", "1 cup", "1 cup"],
// //     directions: ["step 1", "step 2", "step 3"],
// //   },
// //   {
// //     dish_id: 3,
// //     dish: "Burrata Chicken Pizza",
// //     ingredients: ["pizza dough", "chicken", "tomato sauce", "burrata cheese"],
// //     quantities: ["1", "1 cup", "1 cup", "1 cup"],
// //     directions: ["step 1", "step 2", "step 3"],
// //   },
// // ];

// function SearchBarWithChips() {
//   const [state, setState] = useState({
//     query: "",
//     isHidden: true,
//     ingredients: [],
//     selectedItems: [],
//     highlightedIndex: -1,
//     result: [],
//     isCardContainerOpen: false,
//     matchCount: 0,
//   });

//   const [isExactMatch, setIsExactMatch] = useState(false);

//   // const [isCardContainerOpen, setIsCardContainerOpen] = useState(false);

//   const inputRef = useRef();

//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("EXECUTING QUERY: ", state.query);
//           console.log("process.env: ", process.env); // remove thi
//           console.log(
//             "process.env.REACT_APP_API_URL: ",
//             process.env.REACT_APP_API_URL
//           );
//           console.log(
//             "query url: ",
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${state.query}&limit=5`
//           );

//           const { data } = await axios.get(
//             `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${state.query}&limit=5`
//           );

//           console.log("data: ", data);
//           console.log("data['suggestions']: ", data["suggestions"]);
//           console.log("----> selected: ", state.ingredients);

//           // set the ingredients to the products array
//           setState((prevState) => ({
//             ...prevState,
//             ingredients: data["suggestions"] || [],
//           }));

//           //   // set the ingredients to the products array
//           //   setState({ ...state, ingredients: data["suggestions"] || [] });
//           console.log("Setting hidden to FALSE");

//           setState((prevState) => ({ ...prevState, isHidden: false }));
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (state.query) {
//         fetchData();
//       }
//     },
//     200,
//     [state.query]
//   );

//   useEffect(() => {
//     // base search URL by ingredients
//     const base_url = `${process.env.REACT_APP_API_URL}/dev/api/v1/recipes-by-ingredients/?ingredients=`;

//     // join all the selected ingredients with "&" delimiter and replace spaces with +
//     const search_items = state.selectedItems
//       .map((str) => str.replace(/\s+/g, "+"))
//       .join("&ingredients=");

//     // url to query the API for recipes based on the selected ingredients
//     const search_url = `${base_url}${search_items}&limit=5`;

//     console.log("=========================");
//     console.log("==== SECOND API CALL ====");
//     console.log("selectedItems: ", state.selectedItems);
//     console.log("search_items: ", search_items);
//     console.log("search_url: ", search_url);
//     console.log("=========================");

//     const fetchResultsData = async (url) => {
//       try {
//         console.log("---> QUERYING search_url:\n", search_url);

//         const { data } = await axios.get(search_url);

//         console.log("result: ", state.result);
//         console.log("data: ", data);

//         // // Update the results state with the fetched data
//         // setState((prevState) => ({
//         //   ...prevState,
//         //   result: [...prevState.result, data],
//         // }));

//         setState((prevState) => ({
//           ...prevState,
//           result: data || [],
//         }));
//         console.log("=========================");
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (state.selectedItems.length === 0) {
//       setState((prevState) => ({ ...prevState, result: [] }));
//     }
//     if (state.selectedItems.length > 0) {
//       console.log("===== CLEARING RESULTS =====");

//       // Clear the previous results before making new API calls
//       setState((prevState) => ({ ...prevState, result: [] }));
//       // Update isOpen based on the result
//       // setState((prevState) => ({
//       //   ...prevState,
//       //   isCardContainerOpen: state.result && state.result.length > 0,
//       // }));
//       // const updateIsOpen = state.result && state.result.length > 0;

//       // // update isCardContainerOpen state variable
//       // const updateIsOpen = state.result && state.result.length > 0;

//       // console.log("~~~~~~~~~~~~~~~~~~~");
//       // console.log("!!!!! updateIsOpen: ", updateIsOpen, " !!!!!");
//       // console.log("~~~~~~~~~~~~~~~~~~~");
//       // setState((prevState) => ({
//       //   ...prevState,
//       //   isCardContainerOpen: updateIsOpen,
//       // }));

//       // setState(state.result && state.result.length > 0);
//       fetchResultsData(search_url);

//       console.log("=========================");
//     }
//   }, [state.selectedItems]);

//   // When result state changes, update the isCardContainerOpen state boolean to determine
//   // whether to show the CardContainer or not
//   useEffect(() => {
//     // Update isCardContainerOpen based on the result
//     const updateIsOpen = state.result && state.result.length > 0;

//     console.log("~~~~~~~~~~~~~~~~~~~");
//     console.log("!!!!! updateIsOpen: ", updateIsOpen, " !!!!!");
//     console.log("~~~~~~~~~~~~~~~~~~~");

//     setState((prevState) => ({
//       ...prevState,
//       isCardContainerOpen: updateIsOpen,
//     }));
//   }, [state.result]);

//   // set the highlightedIndex state value to -1 when isHidden changes
//   useEffect(() => {
//     if (state.isHidden) {
//       setState((prevState) => ({ ...prevState, highlightedIndex: -1 }));
//     }
//   }, [state.isHidden]);

//   function handleKeyDown(event) {
//     if (event.key === "ArrowDown") {
//       event.preventDefault();

//       console.log("DOWN ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (state.highlightedIndex < state.ingredients.length - 1) {
//         setState((prevState) => ({
//           ...prevState,
//           highlightedIndex: prevState.highlightedIndex + 1,
//         }));
//       }
//       return;
//       // Handle down arrow key press
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();

//       console.log("UP ARROW PRESSED");
//       console.log("----> event: ", event);
//       if (state.highlightedIndex > 0) {
//         setState((prevState) => ({
//           ...prevState,
//           highlightedIndex: prevState.highlightedIndex - 1,
//         }));
//       }

//       // if ArrowUp is pressed and the highlightedIndex is at the beginning
//       // of the suggestion array (index == 0),
//       // then set highlightedIndex to -1 (default), allowing the user to enter their custom inputs
//       if (state.highlightedIndex === 0) {
//         setState((prevState) => ({ ...prevState, highlightedIndex: -1 }));
//       }
//       return;
//       // Handle up arrow key press
//     } else if (event.key === "Enter") {
//       console.log("ENTER PRESSED");
//       console.log("----> event: ", event);
//       event.preventDefault();

//       if (state.query !== "") {
//         const matchingIngredient = state.ingredients.find(
//           (ingredient) => ingredient.suggestions === state.query
//         );

//         if (matchingIngredient) {
//           setIsExactMatch(true); // Set isExactMatch to true for exact matches

//           handleItemClick(matchingIngredient.suggestions);
//         } else {
//           setIsExactMatch(false); // Set isExactMatch to false for custom inputs
//           const updatedItems = [...state.selectedItems, state.query];
//           setState((prevState) => ({
//             ...prevState,
//             selectedItems: updatedItems,
//           }));
//           clearSearch();
//           inputRef.current.focus();
//         }
//       }
//       // // if a non-empty query is given AND no suggested  ingredients are highlighted(-1 index)
//       // // THEN add the query to the selectedItems list
//       // if (state.query !== "" && state.highlightedIndex === -1) {
//       //   console.log(
//       //     "QUERY NOT EMPTY AND highlightedIndex  === -1, adding 'query' to selectedItems "
//       //   );
//       //   console.log("--> query: ", state.query);
//       //   console.log("--> selectedItems: ", state.selectedItems);

//       //   const updatedItems = [...state.selectedItems, state.query];

//       //   console.log("--> UPDATING updatedItems: ", updatedItems);
//       //   // setQuery(query);
//       //   setState((prevState) => ({
//       //     ...prevState,
//       //     selectedItems: updatedItems,
//       //   }));
//       //   // setQuery("");
//       //   clearSearch();
//       //   inputRef.current.focus();
//       //   return;
//       // }

//       // // if any suggested ingredients have been
//       // // put into ingredients state variable,
//       // // - select the highlighted ingredient
//       // // - add it to the selectedItems list
//       // // - close the ingredients dropdown (set hidden to true)
//       // // - clear the search bar
//       // // - refocus on the search bar
//       // if (state.ingredients.length > 0) {
//       //   const updatedItems = [
//       //     ...state.selectedItems,
//       //     state.ingredients[state.highlightedIndex],
//       //   ];

//       //   console.log("--> UPDATING updatedItems: ", updatedItems);
//       //   console.log(
//       //     "--> SELECTING OPTION ingredients[highlightedIndex]: ",
//       //     state.ingredients[state.highlightedIndex]
//       //   );

//       //   setState((prevState) => ({
//       //     ...prevState,
//       //     query: state.ingredients[state.highlightedIndex],
//       //     selectedItems: updatedItems,
//       //     isHidden: true,
//       //   }));

//       //   clearSearch();
//       //   inputRef.current.focus();
//       //   return;
//       // }

//       // // if no suggested ingredients have been put into ingredients state variable,
//       // // and a non-empty string has been given, then add this to the selectedItems state list
//       // if (state.query !== "") {
//       //   console.log("--> highlightedIndex  === -1: ");
//       //   console.log("--> query: ", state.query);

//       //   const updatedItems = [...state.selectedItems, state.query];
//       //   console.log("--> UPDATING updatedItems: ", updatedItems);
//       //   setState((prevState) => ({
//       //     ...prevState,
//       //     selectedItems: updatedItems,
//       //   }));
//       //   // setQuery("");
//       //   clearSearch();
//       // inputRef.current.focus();
//       // return;
//       // }
//     } else if (event.key === "Backspace" && state.query === "") {
//       event.preventDefault();

//       let selected_items = state.selectedItems;
//       console.log("------> selected_items: ", selected_items);
//       console.log("------> selected_items.length: ", selected_items.length);
//       // remove the last item from the selected items list
//       if (selected_items.length > 0) {
//         setState((prevState) => ({
//           ...prevState,
//           selectedItems: selected_items.slice(0, -1),
//         }));
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
//     const updatedItems = [
//       ...state.selectedItems,
//       state.ingredients[state.highlightedIndex],
//     ];
//     console.log("--->handleItemClick updatedItems: ", updatedItems);
//     console.log(
//       "--->handleItemClick ingredients[highlightedIndex].title: ",
//       state.ingredients[state.highlightedIndex].title
//     );

//     setState((prevState) => ({
//       ...prevState,
//       selectedItems: updatedItems,
//     }));

//     clearSearch();
//     inputRef.current.focus(); // Refocus on the input
//   }

//   // handle when the remove button is clicked on one of the IngredientBadge components
//   function handleDeleteClick(toBeRemoved) {
//     console.log("DELETE CLICKED");
//     console.log("----> toBeRemoved: ", toBeRemoved);

//     const newSelectedItems = state.selectedItems.filter(
//       (item) => item !== toBeRemoved
//     );
//     setState((prevState) => ({
//       ...prevState,
//       isHidden: true,
//       selectedItems: newSelectedItems,
//     }));
//     // inputRef.current.focus(); // Refocus on the input
//   }

//   function isOptionSelected(option) {
//     return option === state.query;
//   }
//   //   // resets the query to an empty string and the ingredients to an empty array
//   function clearSearch() {
//     setState((prevState) => ({
//       ...prevState,
//       query: "",
//       isHidden: false,
//       ingredients: [],
//     }));
//   }

//   function matchIngredients(recipes, chosen) {
//     let matches = [];

//     recipes.forEach((recipe, index) => {
//       // console.log("recipe[ingreds]: ", recipe["ingredients"], "\n================");

//       let recipe_matches = {
//         count: 0,
//         total_ingredients: recipe["ingredients"].length,
//         percent_match: 0,
//         matched_ingredients: [],
//       };

//       chosen.forEach((item) => {
//         // console.log("item: ", item);
//         if (recipe["ingredients"].includes(item)) {
//           // console.log("FOUND A MATCH: ", item);
//           recipe_matches.count++;
//           recipe_matches.percent_match =
//             recipe_matches.count / recipe_matches.total_ingredients;
//           recipe_matches.matched_ingredients.push(item);
//         }
//       });

//       matches.push(recipe_matches);
//     });

//     return matches;
//   }

//   return (
//     <>
//       <section className="flex justify-center">
//         {/* <div className={styles["search-bar-container"]}> */}
//         <div className="relative flex flex-wrap items-center justify-center gap-1 w-80 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500">
//           {state.selectedItems.map((item, index) => (
//             <IngredientBadge
//               key={`${item}_${index}`}
//               item={item}
//               onDeleteClick={() => handleDeleteClick(item)}
//               onClick={(event) => event.stopPropagation()}
//               clearSearch={clearSearch}
//             />
//           ))}
//           <input
//             ref={inputRef}
//             onFocus={() =>
//               setState((prevState) => ({ ...prevState, isHidden: false }))
//             }
//             onBlur={async () => {
//               setTimeout(() => {
//                 setState((prevState) => ({ ...prevState, isHidden: true }));
//               }, 200);
//             }}
//             type="text"
//             // className={styles.textbox}
//             className="flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-black"
//             // className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 box-border"
//             // className="block w-full transition ease-in-out delay-0.2s px-4 py-2 text-purple-700 bg-white box-border border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
//             // className="flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-black"
//             value={state.query}
//             onChange={(e) =>
//               setState((prevState) => ({ ...prevState, query: e.target.value }))
//             }
//             onKeyDown={handleKeyDown}
//             placeholder="Search..."
//           />
//           <ul
//             // className={`${styles["options"]} ${
//             //   !state.isHidden &
//             //   (state.query !== "") &
//             //   (state.ingredients.length > 0)
//             //     ? styles["show"]
//             //     : ""
//             // }`}
//             // className={`absolute list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md w-full left-0 top-full bg-white z-10 ${
//             //   !state.isHidden &
//             //   (state.query !== undefined) &
//             //   (state.ingredients.length > 0)
//             //     ? "block"
//             //     : undefined
//             // }`}
//             className={`absolute list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md w-full left-0 top-full bg-white z-10 ${
//               state.query && state.ingredients.length > 0 && !state.isHidden
//                 ? "block"
//                 : "hidden"
//             }`}
//           >
//             {state.ingredients.map((ingred, index) => (
//               <li
//                 // key={index}
//                 key={`${ingred.length}_${index}`}
//                 // className={`${styles.option}
//                 // ${isOptionSelected(ingred) ? styles.selected : ""}
//                 // ${
//                 //   index === state.highlightedIndex && isOptionSelected(ingred)
//                 //     ? styles["highlight-selected"]
//                 //     : ""
//                 // }
//                 // ${
//                 //   index === state.highlightedIndex && !isOptionSelected(ingred)
//                 //     ? styles.highlighted
//                 //     : ""
//                 // }`}
//                 className={`p-2 cursor-pointer ${
//                   isOptionSelected(ingred)
//                     ? "p-2 cursor-pointer bg-emerald-100"
//                     : undefined
//                 } ${
//                   index === state.highlightedIndex && isOptionSelected(ingred)
//                     ? "p-2 cursor-pointer bg-emerald-300"
//                     : undefined
//                 } ${
//                   index === state.highlightedIndex && !isOptionSelected(ingred)
//                     ? "p-2 cursor-pointer bg-emerald-500"
//                     : ""
//                 }`}
//                 // className={`p-2 cursor-pointer ${
//                 //   isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-100"
//                 //     : undefined
//                 // } ${
//                 //   index === state.highlightedIndex && isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-300"
//                 //     : undefined
//                 // } ${
//                 //   index === state.highlightedIndex && !isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-500"
//                 //     : ""
//                 // }`}
//                 // className={`p-2 cursor-pointer ${
//                 //   isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-100"
//                 //     : isExactMatch
//                 //     ? "p-2 cursor-pointer bg-yellow-300" // Use bright yellow for exact matches
//                 //     : ""
//                 // } ${
//                 //   index === state.highlightedIndex && isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-300"
//                 //     : index === state.highlightedIndex &&
//                 //       !isOptionSelected(ingred)
//                 //     ? "p-2 cursor-pointer bg-emerald-500"
//                 //     : ""
//                 // }`}
//                 onClick={() => {
//                   setIsExactMatch(true); // Set isExactMatch to true when clicked
//                   setState((prevState) => ({
//                     ...prevState,
//                     query: ingred.suggestions,
//                   }));
//                   handleItemClick(ingred.suggestions);
//                   setState((prevState) => ({ ...prevState, isHidden: false }));
//                   clearSearch();
//                 }}
//                 onMouseEnter={() => {
//                   setIsExactMatch(false); // Set isExactMatch to false on mouseover
//                   setState((prevState) => ({
//                     ...prevState,
//                     highlightedIndex: index,
//                   }));
//                 }}
//               >
//                 {ingred}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//       <CardContainer
//         result={state.result}
//         selected_items={state.selectedItems}
//         isOpen={state.isCardContainerOpen}
//       />
//     </>
//   );
//   // return (
//   //   <>
//   //     <section className="flex justify-center">
//   //       {/* <div className={styles["search-bar-container"]}> */}
//   //       <div className="relative flex flex-wrap items-center justify-center gap-2 w-80 min-h-12 bg-emerald-100 border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500">
//   //         {state.selectedItems.map((item, index) => (
//   //           <IngredientBadge
//   //             key={`${item}_${index}`}
//   //             item={item}
//   //             onDeleteClick={() => handleDeleteClick(item)}
//   //             onClick={(event) => event.stopPropagation()}
//   //             clearSearch={clearSearch}
//   //           />
//   //         ))}
//   //         <input
//   //           ref={inputRef}
//   //           onFocus={() =>
//   //             setState((prevState) => ({ ...prevState, isHidden: false }))
//   //           }
//   //           onBlur={async () => {
//   //             setTimeout(() => {
//   //               setState((prevState) => ({ ...prevState, isHidden: true }));
//   //             }, 200);
//   //           }}
//   //           type="text"
//   //           className={styles.textbox}
//   //           // className="flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-black"
//   //           value={state.query}
//   //           onChange={(e) =>
//   //             setState((prevState) => ({ ...prevState, query: e.target.value }))
//   //           }
//   //           onKeyDown={handleKeyDown}
//   //           placeholder="Search..."
//   //         />
//   //         <ul
//   //           // className={`${styles["options"]} ${
//   //           //   !state.isHidden &
//   //           //   (state.query !== "") &
//   //           //   (state.ingredients.length > 0)
//   //           //     ? styles["show"]
//   //           //     : ""
//   //           // }`}
//   //           className={`absolute list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md w-full left-0 top-full bg-white z-10 ${
//   //             !state.isHidden &
//   //             (state.query !== undefined) &
//   //             (state.ingredients.length > 0)
//   //               ? "block"
//   //               : undefined
//   //           }`}
//   //         >
//   //           {state.ingredients.map((ingred, index) => (
//   //             <li
//   //               // key={index}
//   //               key={`${ingred.length}_${index}`}
//   //               // className={`${styles.option}
//   //               // ${isOptionSelected(ingred) ? styles.selected : ""}
//   //               // ${
//   //               //   index === state.highlightedIndex && isOptionSelected(ingred)
//   //               //     ? styles["highlight-selected"]
//   //               //     : ""
//   //               // }
//   //               // ${
//   //               //   index === state.highlightedIndex && !isOptionSelected(ingred)
//   //               //     ? styles.highlighted
//   //               //     : ""
//   //               // }`}
//   //               className={`p-2 cursor-pointer ${
//   //                 isOptionSelected(ingred)
//   //                   ? "p-2 cursor-pointer bg-emerald-100"
//   //                   : undefined
//   //               } ${
//   //                 index === state.highlightedIndex && isOptionSelected(ingred)
//   //                   ? "p-2 cursor-pointer bg-emerald-300"
//   //                   : undefined
//   //               } ${
//   //                 index === state.highlightedIndex && !isOptionSelected(ingred)
//   //                   ? "p-2 cursor-pointer bg-emerald-500"
//   //                   : ""
//   //               }`}
//   //               onClick={() => {
//   //                 setState((prevState) => ({
//   //                   ...prevState,
//   //                   query: ingred.suggestions,
//   //                 }));
//   //                 handleItemClick(ingred.suggestions);
//   //                 setState((prevState) => ({ ...prevState, isHidden: false }));
//   //                 clearSearch();
//   //               }}
//   //               onMouseEnter={() => {
//   //                 setState((prevState) => ({
//   //                   ...prevState,
//   //                   highlightedIndex: index,
//   //                 }));
//   //               }}
//   //             >
//   //               {ingred}
//   //             </li>
//   //           ))}
//   //         </ul>
//   //       </div>
//   //     </section>
//   //     <section className="section">
//   //       <div className="">
//   //         {/* <div className="columns is-multiline"> */}
//   //         {/* <div className="flex items-center justify-center p-10"> */}
//   //         <div className="flex flex-wrap">
//   //           {state.result.map((recipe, index) => (
//   //             <div
//   //               // className="column is-multiline is-one-fifth"
//   //               // className="column is-multiline is-4"
//   //               className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4"
//   //               // className="column is-multiline is-12-mobile is-6-tablet is-4-desktop"
//   //               key={index}
//   //             >
//   //               <RecipeCard
//   //                 key={recipe.dish_id}
//   //                 selected_ingredients={state.selectedItems}
//   //                 dish={recipe.dish}
//   //                 ingredients={recipe.ingredients}
//   //                 quantities={recipe.quantities}
//   //                 directions={recipe.directions}
//   //               />
//   //             </div>
//   //           ))}
//   //         </div>
//   //         {/* </div> */}
//   //       </div>
//   //     </section>
//   //   </>
//   // );
// }

// export default SearchBarWithChips;

///////////////////////////////////////
