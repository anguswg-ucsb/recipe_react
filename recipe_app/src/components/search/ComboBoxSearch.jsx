import React, { useState, useEffect, useRef } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import IngredientBadge from "./IngredientBadge";
import CardContainer from "./CardContainer";

function ComboBoxSearch() {
  const [state, setState] = useState({
    query: "",
    ingredients: [],
    selectedItems: [],
    highlightedIndex: -1,
    result: [],
    isCardContainerOpen: false,
  });

  const inputRef = useRef();

  useDebounce(
    () => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/dev/api/v1/suggested-ingredients/?search=${state.query}&limit=5`
          );
          console.log("--> state.query: ", state.query);
          console.log("--> state.ingredients: ", state.ingredients);
          console.log("--> state.selectedItems: ", state.selectedItems);
          setState((prevState) => ({
            ...prevState,
            ingredients: data["suggestions"] || [],
          }));

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
    const base_url = `${process.env.REACT_APP_API_URL}/dev/api/v1/recipes-by-ingredients/?ingredients=`;
    const search_items = state.selectedItems
      .map((str) => str.replace(/\s+/g, "+"))
      .join("&ingredients=");
    const search_url = `${base_url}${search_items}&limit=5`;

    const fetchResultsData = async (url) => {
      try {
        const { data } = await axios.get(search_url);
        setState((prevState) => ({
          ...prevState,
          result: data || [],
        }));
      } catch (error) {
        console.log(error);
      }
    };
    console.log("--> state.query: ", state.query);
    console.log("--> state.ingredients: ", state.ingredients);
    console.log("--> state.selectedItems: ", state.selectedItems);
    if (state.selectedItems.length === 0) {
      setState((prevState) => ({ ...prevState, result: [] }));
    }
    if (state.selectedItems.length > 0) {
      setState((prevState) => ({ ...prevState, result: [] }));
      fetchResultsData(search_url);
    }
  }, [state.selectedItems]);

  useEffect(() => {
    const updateIsOpen = state.result && state.result.length > 0;
    setState((prevState) => ({
      ...prevState,
      isCardContainerOpen: updateIsOpen,
    }));
  }, [state.result]);

  useEffect(() => {
    if (state.isHidden) {
      setState((prevState) => ({ ...prevState, highlightedIndex: -1 }));
    }
  }, [state.isHidden]);

  function handleSelectedItemChange() {
    const updatedItems = [...state.selectedItems, state.query];

    console.log("--> UPDATING updatedItems: ", updatedItems);

    setState((prevState) => ({
      ...prevState,
      selectedItems: updatedItems,
    }));
  }
  function isOptionSelected(option) {
    return option === state.query;
  }
  // function handleItemClick(item) {
  //   // ... your existing code ...
  // }

  // function handleDeleteClick(toBeRemoved) {
  //   // ... your existing code ...
  // }
  // <div className="relative flex flex-wrap items-center justify-center gap-2 w-80 min-h-12 bg-emerald-100 border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500">
  //   {state.selectedItems.map((item, index) => (
  //             <IngredientBadge
  //               key={`${item}_${index}`}
  //               item={item}
  //               onDeleteClick={() => handleDeleteClick(item)}
  //               onClick={(event) => event.stopPropagation()}
  //               clearSearch={clearSearch}
  //             />
  //   ))}
  // </div>
  // function isOptionSelected(option) {
  //   return option === state.query;
  // }
  // onChange={(e) =>
  //               setState((prevState) => ({ ...prevState, query: e.target.value }))
  //             }
  return (
    <>
      <section className="flex flex-col justify-center align-center">
        <Combobox
          multiple
          value={state.selectedItems}
          onChange={handleSelectedItemChange}
        >
          {state.selectedItems.length > 0 && (
            <ul>
              <div className="relative flex flex-wrap items-center justify-center gap-2 w-80 min-h-12 bg-emerald-100 border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500">
                {state.selectedItems.map((item, index) => (
                  <IngredientBadge
                    key={`${item}_${index}`}
                    item={item}
                    // onDeleteClick={() => handleDeleteClick(item)}
                    // onClick={(event) => event.stopPropagation()}
                    // clearSearch={clearSearch}
                  />
                ))}
              </div>
            </ul>
          )}
          <Combobox.Input
            // className="w-full" // Set width to 100%
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, query: e.target.value }))
            }
          />
          <Combobox.Options
          // className={`list-none border border-solid border-gray-300 max-h-40 overflow-y-auto rounded-md left-0 top-full bg-white z-10 ${
          //   !state.isHidden &
          //   (state.query !== undefined) &
          //   (state.ingredients.length > 0)
          //     ? "block"
          //     : undefined
          // }`}
          >
            {state.ingredients.map((ingred, index) => (
              <Combobox.Option
                // as="li"
                // className={`p-2 cursor-pointer ${
                //   isOptionSelected(ingred)
                //     ? "p-2 cursor-pointer bg-emerald-100"
                //     : undefined
                // } ${
                //   index === state.highlightedIndex && isOptionSelected(ingred)
                //     ? "p-2 cursor-pointer bg-emerald-300"
                //     : undefined
                // } ${
                //   index === state.highlightedIndex && !isOptionSelected(ingred)
                //     ? "p-2 cursor-pointer bg-emerald-500"
                //     : ""
                // }`}
                key={index}
                value={ingred}
              >
                {ingred}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </section>
      {/* ... your existing code ... */}
    </>
  );
}

export default ComboBoxSearch;
