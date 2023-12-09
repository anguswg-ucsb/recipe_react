// // // // // // // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // // // // // //
// RecipePill.jsx
import React, { useState, useEffect } from "react";

let selected_ingredients = ["chicken", "carrot", "ketchup", "bread", "pickles"];

// // example data
let recipe_data = [
  {
    dish_id: 1,
    dish: "Chicken Parmesan",
    ingredients: [
      "chicken",
      "tomato sauce",
      "mozzarella cheese",
      "apple",
      "banana",
      "carrot",
      "ketchup",
      "bread",
      "pickles",
    ],
    quantities: ["1", "1 cup", "1 cup"],
    directions: ["step 1", "step 2", "step 3"],
  },
  {
    dish_id: 2,
    dish: "Chicken Marsala",
    ingredients: ["chicken", "marsala wine", "mushrooms"],
    quantities: ["1", "1 cup", "1 cup"],
    directions: ["step 1", "step 2", "step 3"],
  },
  {
    dish_id: 3,
    dish: "Burrata Chicken Pizza",
    ingredients: ["pizza dough", "chicken", "tomato sauce", "burrata cheese"],
    quantities: ["1", "1 cup", "1 cup", "1 cup"],
    directions: ["step 1", "step 2", "step 3"],
  },
  {
    dish_id: 4,
    dish: "Chicken Picatta",
    ingredients: ["chicken", "tomato sauce", "mozzarella cheese"],
    quantities: ["1", "1 cup", "1 cup"],
    directions: ["step 1", "step 2", "step 3"],
  },
];

const RecipePill = ({
  dish,
  ingredients,
  selected_ingredients,
  match_stats,
}) => {
  // state for if all selected ingredients are in recipe
  const [exactMatch, setExactMatch] = useState(false);

  // state for if recipe is expanded
  const [expanded, setExpanded] = useState(false);

  // // state for active tab
  function toggleExpanded() {
    setExpanded(!expanded);
  }
  // const toggleExpanded = () => setExpanded((current) => !current);

  function renderTabContent() {
    return ingredients.map((ingredient, index) => (
      // <li key={index}>{ingredient}</li>
      <span
        key={index}
        // className={`text-white text-xs font-bold rounded-lg inline-block mt-4 ml-4 py-1.5 px-4 ${
        className={`text-black text-xs font-bold rounded-lg inline-block p-2 m-2 ${
          selected_ingredients.includes(ingredient)
            ? "bg-green-500"
            : "bg-red-500/40"
        }`}
      >
        {ingredient}
      </span>
    ));
  }
  // useEffect to update exactMatch when selected_ingredients or ingredients change
  // if the length of selected_ingredients is equal to the length of ingredients, then set exactMatch to true and
  // update the progress bar color class from bg-green-200 to bg-green-500
  useEffect(() => {
    setExactMatch(selected_ingredients.length === ingredients.length);
  }, [selected_ingredients, ingredients]);

  console.log("================");
  console.log("===== RECIPE PILL ====");
  console.log("dish: ", dish);
  console.log("ingredients: ", ingredients);
  console.log("selected_ingredients: ", selected_ingredients);
  console.log("match_stats.pct_match: ", match_stats.pct_match);
  console.log("match_stats.pct_match_str: ", match_stats.pct_match_str);
  console.log("match_stats.fraction_str: ", match_stats.fraction_str);
  //   console.log("percent_match: ", percent_match);
  //   console.log("pct_match_str: ", pct_match_str);
  //   console.log("fraction_match_str: ", fraction_match_str);
  console.log("================");
  console.log("================");
  // class for progress bar div (colored background). When an exact match is found,
  //  the class is bg - green - 500, otherwise it is bg - green - 200
  let progress_bar_style = exactMatch
    ? "absolute top-0 right-0 bottom-0 left-0 bg-green-500 opacity-75 rounded-l"
    : "absolute top-0 right-0 bottom-0 left-0 bg-green-500 opacity-50 rounded-l";

  let expanded_styles = expanded
    ? "text-xs border-box p-2 font-bold bg-slate-100/0"
    : "text-xs border-box p-2 font-bold";

  let pill_styles =
    "grid grid-cols-6 m-1 border border-slate-500/50 shadow-lg overflow-hidden rounded-md";
  // let pill_styles = "grid grid-cols-6 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl";

  console.log("expanded: ", expanded);
  console.log("expanded_styles: ", expanded_styles);

  return (
    <>
      <div class="z-200 bg-slate-200/100 rounded-md p-1 border border-slate-/0">
        {/* <div> */}
        <div onClick={toggleExpanded} class={pill_styles}>
          <div class="col-start-1 col-span-5">
            <div className="relative">
              <div className="flex flex-row p-2 rounded-l overflow-hidden bg-slate-200/75">
                <div className="text-center font-bold relative z-10">
                  {dish}
                </div>
              </div>
              <div
                className={progress_bar_style}
                style={{ width: match_stats.pct_match_str }}
              ></div>
            </div>
          </div>
          <div class="col-start-6 col-span-1 flex items-center justify-center text-center rounded-r bg-slate-200/100 border-l border-slate-500/50 justify-items-center">
            <div class={expanded_styles}>
              {/* <div class="text-xs border-box p-2 font-bold"> */}
              {match_stats.pct_match_str}
            </div>
          </div>
        </div>
        {expanded && (
          <div className="col-start-1 col-span-6 m-1 shadow-lg rounded-lg overflow-hidden bg-gray-100/100">
            {renderTabContent()}
          </div>
        )}
      </div>
    </>
  );
};

export default RecipePill;

// // // // // // // // // // // // // // // // // // // //  //
// // // // // // // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // // // // // //

// // RecipeCard.jsx
// import React, { useState, useEffect } from "react";
// // import styles from "./SearchBar.module.css";
// // import customStyles from "./styles/custom-bulma.css";

// let selected_ingredients = ["chicken", "carrot", "ketchup", "bread", "pickles"];

// // // example data
// let recipe_data = [
//   {
//     dish_id: 1,
//     dish: "Chicken Parmesan",
//     ingredients: [
//       "chicken",
//       "tomato sauce",
//       "mozzarella cheese",
//       "apple",
//       "banana",
//       "carrot",
//       "ketchup",
//       "bread",
//       "pickles",
//     ],
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
//   {
//     dish_id: 4,
//     dish: "Chicken Picatta",
//     ingredients: ["chicken", "tomato sauce", "mozzarella cheese"],
//     quantities: ["1", "1 cup", "1 cup"],
//     directions: ["step 1", "step 2", "step 3"],
//   },
// ];

// const RecipePill = ({
//   dish,
//   ingredients,
//   selected_ingredients,
//   match_stats,
// }) => {
//   //   // example data
//   //   let tmp_recipe = {
//   //     dish_id: 1,
//   //     dish: "Chicken Parmesan",
//   //     ingredients: [
//   //       "chicken", "tomato sauce",  "mozzarella cheese",
//   //       "apple", "banana",   "carrot",
//   //       "ketchup",  "bread",  "pickles",
//   //     ],
//   //     quantities: ["1", "1 cup", "1 cup"],
//   //     directions: ["step 1", "step 2", "step 3"],
//   //   };
//   //   let dish = tmp_recipe.dish;
//   //   let ingredients = tmp_recipe.ingredients;

//   //   let selected_ingredients = [
//   //     "chicken",
//   //     "carrot",
//   //     "ketchup",
//   //     "bread",
//   //     "pickles",
//   //   ];

//   //   let selected_ingredients = [];

//   //   exactMatch =
//   // state for if all selected ingredients are in recipe
//   const [exactMatch, setExactMatch] = useState(false);

//   // state for if recipe is expanded
//   const [isExpanded, setIsExpanded] = useState(false);

//   // state for active tab
//   function handleExpand() {
//     setIsExpanded(!isExpanded);
//   }

//   //  const [activeTab, setActiveTab] = useState("ingredients");

//   // function handleTabChange(tab) {
//   // setActiveTab(tab);
//   //   }

//   // useEffect to update exactMatch when selected_ingredients or ingredients change
//   // if the length of selected_ingredients is equal to the length of ingredients, then set exactMatch to true and
//   // update the progress bar color class from bg-green-200 to bg-green-500
//   useEffect(() => {
//     setExactMatch(selected_ingredients.length === ingredients.length);
//   }, [selected_ingredients, ingredients]);
//   // function handleTabChange(tab) {
//   // setActiveTab(tab);
//   //   }

//   //   // given a count and total number of items, return an object with percentage match, percentage match string, and fraction string
//   //   function getPercentMatch(count, total) {
//   //     // calculate percentage match
//   //     let percent_match = count / total;
//   //     percent_match = parseFloat(percent_match).toFixed(1) * 100;
//   //     // let percent_match = (count / total) * 100;
//   //     // let percent_match = count / total;

//   //     // make sure percentage is less than 100%
//   //     percent_match = Math.min(percent_match, 100);
//   //     // percent_match = Math.min(percent_match, 1);

//   //     // round percentage to one decimal
//   //     percent_match = parseFloat(percent_match.toFixed(1));
//   //     // percent_match = parseFloat(percent_match).toFixed(1);

//   //     // create match stats object
//   //     const matches = {
//   //       pct_match: percent_match,
//   //       pct_match_str: percent_match + "%",
//   //       fraction_str: `${Math.min(count, total)} / ${total}`,
//   //     };

//   //     // // create match stats object
//   //     // const matches = {
//   //     //   pct_match: percent_match * 100,
//   //     //   pct_match_str: percent_match * 100 + "%",
//   //     //   fraction_str: `${Math.min(count, total)} / ${total}`,
//   //     // };

//   //     return matches;
//   //   }

//   //   // get matching stats and strings
//   //   let match_stats = getPercentMatch(
//   //     selected_ingredients.length,
//   //     ingredients.length
//   //   );
//   console.log("================");
//   console.log("===== RECIPE PILL ====");
//   console.log("dish: ", dish);
//   console.log("ingredients: ", ingredients);
//   console.log("selected_ingredients: ", selected_ingredients);
//   console.log("match_stats.pct_match: ", match_stats.pct_match);
//   console.log("match_stats.pct_match_str: ", match_stats.pct_match_str);
//   console.log("match_stats.fraction_str: ", match_stats.fraction_str);
//   //   console.log("percent_match: ", percent_match);
//   //   console.log("pct_match_str: ", pct_match_str);
//   //   console.log("fraction_match_str: ", fraction_match_str);
//   console.log("================");
//   console.log("================");
//   // class for progress bar div (colored background). When an exact match is found,
//   //  the class is bg - green - 500, otherwise it is bg - green - 200
//   let progress_bar_style = exactMatch
//     ? "absolute top-0 right-0 bottom-0 left-0 bg-green-500 opacity-75 rounded-l"
//     : "absolute top-0 right-0 bottom-0 left-0 bg-green-500 opacity-50 rounded-l";

//   let expanded_styles = isExpanded
//     ? "text-xs border-box p-2 font-bold bg-red-500"
//     : "text-xs border-box p-2 font-bold";

//   console.log("isExpanded: ", isExpanded);
//   console.log("expanded_styles: ", expanded_styles);
//   return (
//     <>
//       <div
//         onClick={handleExpand}
//         class="grid grid-cols-6 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
//       >
//         <div class="col-start-1 col-span-5">
//           <div className="relative">
//             <div className="flex flex-row p-2 rounded-l overflow-hidden bg-slate-200/75">
//               <div className="text-center font-bold relative z-10">{dish}</div>
//             </div>
//             <div
//               className={progress_bar_style}
//               style={{ width: match_stats.pct_match_str }}
//             ></div>
//           </div>
//         </div>
//         <div class="col-start-6 col-span-1 flex items-center justify-center text-center rounded-r bg-slate-200/100 border-l border-slate-400/50 justify-items-center">
//           <div class={expanded_styles}>
//             {/* <div class="text-xs border-box p-2 font-bold"> */}
//             {match_stats.pct_match_str}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RecipePill;
