// ##################### WORKING AS OF 11/20 PM ####################################
// CardContainer.jsx
import React, { useState, useEffect } from "react";
import RecipePill from "./RecipePill";
import { Transition } from "@headlessui/react";
// import { useTimeoutFn } from "react-use";
// import { useTimeoutFn } from "react";
import { useTimeoutFn } from "../../hooks/useTimeoutFn";

function PillContainer({ result, selected_items, isOpen }) {
  const [activeCardId, setActiveCardId] = useState("");

  const [isTransitioning, setIsTransitioning] = useState(true);
  const [, , resetTransition] = useTimeoutFn(
    () => setIsTransitioning(true),
    500
  );

  useEffect(() => {
    if (!isOpen) {
      setIsTransitioning(false);
      resetTransition();
    }
  }, [isOpen]);

  console.log("result: ", result);
  console.log("RENDER PILL CONTAINER");
  console.log("====================================");
  // given a count and total number of items, return an object with percentage match, percentage match string, and fraction string
  function getPercentMatch(count, total) {
    // calculate percentage match
    let percent_match = count / total;
    percent_match = parseFloat(percent_match).toFixed(1) * 100;

    // make sure percentage is less than 100%
    percent_match = Math.min(percent_match, 100);

    // round percentage to one decimal
    percent_match = parseFloat(percent_match.toFixed(1));

    // create match stats object
    const matches = {
      pct_match: percent_match,
      pct_match_str: percent_match + "%",
      fraction_str: `${Math.min(count, total)} / ${total}`,
    };

    return matches;
  }
  // iterate over result array and return a new array of objects with dish, ingredients, and order based on percent match from getPercentMatch function

  // Calculate percent match for each dish
  result.forEach((dish) => {
    const matchStats = getPercentMatch(
      selected_items.length,
      dish.ingredients.length
    );
    //   dish.percentMatch = matchStats.pct_match;
    dish.match_stats = matchStats;
    // dish.percentMatch = matchStats.pct_match;
  });

  // Sort the result array based on percent match in descending order
  result.sort((a, b) => b.match_stats.pct_match - a.match_stats.pct_match);

  //   // function to sort result array by dish name
  //   function AlphaDishOrder(a, b) {
  //     if (a.dish < b.dish) {
  //       return -1;
  //     }
  //     if (a.order > b.order) {
  //       return 1;
  //     }
  //     return 0;
  //   }

  return (
    <>
      <Transition
        appear={true}
        show={isOpen}
        class="p-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        // class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5"
        // class="flex flex-wrap"
      >
        {result.map((recipe, index) => (
          <FadeIn key={recipe.dish_id} index={index} totalItems={result.length}>
            <RecipePill
              key={recipe.dish_id}
              dish={recipe.dish}
              ingredients={recipe.ingredients}
              selected_ingredients={selected_items}
              match_stats={recipe.match_stats}
            />
          </FadeIn>
        ))}
        {/* {result.sort(AlphaDishOrder).map((recipe, index) => (
          <FadeIn key={recipe.dish_id} index={index} totalItems={result.length}>
            <RecipePill
              key={recipe.dish_id}
              dish={recipe.dish}
              ingredients={recipe.ingredients}
              selected_ingredients={selected_items}
            />
          </FadeIn>
        ))} */}
      </Transition>
    </>
  );
}

function FadeIn({ index, totalItems, children }) {
  //   const delay = `[${index * 500}ms]`; // Adjust the factor as needed

  //   const delay = `[${index + 1 * 200}ms]`; // Adjust the factor as needed

  return (
    <Transition.Child
      enter={`transition-all ease-in-out duration-500 delay-[200ms]`}
      //   enter={`transition-all ease-in-out duration-500 delay-${delay}`}
      enterFrom="transform scale-95 opacity-0 translate-y-6"
      enterTo="transform scale-100 opacity-100 translate-y-0"
      //   enterFrom="opacity-0"
      //   enterTo="opacity-100"
      leave="transition-all ease-in-out duration-300 delay-[200ms]"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      {children}
    </Transition.Child>
  );
}

export default PillContainer;
