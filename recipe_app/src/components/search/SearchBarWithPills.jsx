// ####################### GOOD TO GO (Single state object) #######################
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Transition } from "@headlessui/react";

import axios from "axios";

// styling
// import "bulma/css/bulma.min.css"; // Import Bulma styles
// import styles from "./SearchBar.module.css";

import IngredientBadge from "./IngredientBadge";
// import RecipeCard from "./RecipeCard";
import CardContainer from "./CardContainer";
import RecipePill from "./RecipePill";
import PillContainer from "./PillContainer";
// import TempTransition from "./TempTransition";

// import RecipeCardGrid from "./RecipeCardGrid";
// import ResultGrid from "./ResultGrid";

// import "./SearchBar.scss";

// let recipe_data = [
//   {
//     dish_id: 1,
//     dish: "Chicken Parmesan",
//     ingredients: ["chicken", "tomato sauce", "mozzarella cheese"],
//     quantities: ["1", "1 cup", "1 cup"],
//     directions: ["step 1", "step 2", "step 3"],
//   },
//   {
//     dish_id: 2,
//     dish: "Chicken Marsala",
//     ingredients: ["chicken", "marsala wine", "mushrooms"],
//     quantities: ["1", "1 cup", "1 cup"],
//     directions: ["step 1", "step 2", "step 3"],
//   },
//   {
//     dish_id: 3,
//     dish: "Burrata Chicken Pizza",
//     ingredients: ["pizza dough", "chicken", "tomato sauce", "burrata cheese"],
//     quantities: ["1", "1 cup", "1 cup", "1 cup"],
//     directions: ["step 1", "step 2", "step 3"],
//   },
// ];

function SearchBarWithPills() {
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
  // <className = "relative z-0">

  // className="fixed z-10 flex flex-wrap justify-center items-center inset-x-0 top-0 left-1/2 transform -translate-x-1/2 gap-1 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
  // className="sticky z-10 w-1/2 flex flex-wrap mb-1.5 p-2 justify-between items-center gap-1 top-0 left-1/2 transform -translate-x-1/2 bg-emerald-100 box-border border border-gray-300 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:shadow-2xl"

  return (
    <>
      <div class="relative z-0">
        {/* <div className="fixed z-10 flex justify-center"> */}
        {/* <div className="flex justify-center"> */}
        <div
          // ref={inputRef}
          // tabIndex={0}
          className="sticky z-10 w-1/2 flex flex-wrap mb-1.5 p-2 items-center justify-start gap-1 top-0 left-1/2 transform -translate-x-1/2 bg-emerald-100 box-border border border-gray-300 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:shadow-2xl"
          // className="sticky z-10 w-1/2 flex flex-wrap mb-1.5 p-2 justify-between items-center gap-1 top-0 left-1/2 transform -translate-x-1/2 bg-emerald-100 box-border border border-gray-300 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:shadow-2xl"
          // className="sticky z-10 w-full lg:w-1/2 mx-auto mb-1.5 p-1 flex flex-wrap items-center justify-between gap-1 top-0 bg-emerald-100 box-border border border-gray-300 rounded-md outline-none focus:border-blue-500 shadow-lg transition duration-500 hover:shadow-2xl"
          // className="sticky z-10 flex flex-wrap mb-1.5 p-1 justify-between items-center gap-1 top-0 left-1/2 transform -translate-x-1/2 bg-emerald-100 box-border border border-gray-300 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:shadow-2xl"

          //   className="fixed z-10 flex flex-wrap justify-between items-center inset-x-0 top-0 left-1/2 transform -translate-x-1/2 gap-1 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"

          // className="relative flex flex-wrap items-center justify-center gap-1 w-80 bg-emerald-100 box-border border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
        >
          {/* <div className="flex flex-wrap items-start justify-start"> */}
          {state.selectedItems.map((item, index) => (
            // <div class="w-full">
            <IngredientBadge
              key={`${item}_${index}`}
              item={item}
              onDeleteClick={() => handleDeleteClick(item)}
              onClick={(event) => event.stopPropagation()}
              clearSearch={clearSearch}
            />
            //  </div>
          ))}
          {/* </div> */}
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
            // className="z-10 flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 box-border max-w-[calc(100% - 8px)]"
            // className="z-10 flex-grow border border-solid border-gray-300 h-10 px-2 rounded-md outline-none transition duration-200 focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 box-border"
            className="z-10 w-full flex-grow border border-solid border-gray-300 max-h-full h-10 px-2 rounded-md outline-none transition duration-200 focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 box-border"
            //   className="z-10 flex-grow p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
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
            //   className="absolute list-none border w-full top-full left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 w-80 rounded-md overflow-hidden"
            // className={`z-100 list-none border border-solid border-gray-300 max-h-40 overflow-y-scroll rounded-md w-full left-0 top-full bg-white ${
            className={`absolute list-none border w-full top-full left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 w-80 rounded-md max-h-40 overflow-y-auto rounded-md bg-white ${
              state.query && state.ingredients.length > 0 && !state.isHidden
                ? "block"
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
        {/* </div> */}
        {/* <div className="z-100 flex justify-between"> */}
        <div className="z-100 flex justify-center">
          {/* <div className="z-100 mt-20 grid grid-cols-3 gap-4 left-1/2 transform -translate-x-1/2"> */}
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

export default SearchBarWithPills;
