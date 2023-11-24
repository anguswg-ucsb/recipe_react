// ##################### WORKING AS OF 11/20 PM ####################################
// CardContainer.jsx
import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { Transition } from "@headlessui/react";
// import { useTimeoutFn } from "react-use";
// import { useTimeoutFn } from "react";
import { useTimeoutFn } from "../../hooks/useTimeoutFn";

function CardContainer({ result, selected_items, isOpen }) {
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
  console.log("RENDER CARD CONTAINER");
  console.log("====================================");
  // Full function for readability
  function AlphaDishOrder(a, b) {
    if (a.dish < b.dish) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }
  // result.sort(AlphaDishOrder)
  return (
    <>
      <Transition
        appear={true}
        show={isOpen}
        // class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5"
        //   class="flex flex-wrap"
        class="p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"
        // enter="transition-all ease-in-out duration-[1500ms] delay-[500ms]"
        // enterFrom="transform  max-h-0"
        // enterTo="transform  max-h-[1000px]"
        // leave="transition-all ease-in-out duration-[1200ms]"
        // leaveFrom="transform  max-h-[1000px]"
        // leaveTo="transform  max-h-0"
        // afterLeave={() => {
        //   setIsTransitioning(false);
        //   resetTransition();
        // }}
      >
        {result.sort(AlphaDishOrder).map(
          (recipe, index) => (
            <FadeIn
              key={recipe.dish_id}
              index={index}
              totalItems={result.length}
            >
              <RecipeCard
                key={recipe.dish_id}
                selected_ingredients={selected_items}
                dish={recipe.dish}
                ingredients={recipe.ingredients}
                quantities={recipe.quantities}
                directions={recipe.directions}
              />
            </FadeIn>
          )
          // <Transition.Child
          //   enter="transition-all ease-in-out duration-500 delay-[200ms]"
          //   enterFrom="opacity-0 translate-y-6"
          //   enterTo="opacity-100 translate-y-0"
          //   leave="transition-all ease-in-out duration-300"
          //   leaveFrom="opacity-100"
          //   leaveTo="opacity-0"
          // >
          //   <RecipeCard
          //     key={recipe.dish_id}
          //     selected_ingredients={selected_items}
          //     dish={recipe.dish}
          //     ingredients={recipe.ingredients}
          //     quantities={recipe.quantities}
          //     directions={recipe.directions}
          //   />
          // </Transition.Child>
        )}
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

export default CardContainer;
// // ##################### WORKING AS OF 11/20 PM ####################################
// // CardContainer.jsx
// import React, { useState, useEffect } from "react";
// import RecipeCard from "./RecipeCard";
// import { Transition } from "@headlessui/react";
// // import { Fragment } from "react";

// function CardContainer({ result, selected_items, isOpen }) {
//   const [activeCardId, setActiveCardId] = useState("");
//   //   const [isOpen, setIsOpen] = useState(true); // Adjust the initial state as needed
//   //   const [isOpen, setIsOpen] = useState(false); // Adjust the initial state as needed

//   console.log("result: ", result);
//   console.log("RENDER CARD CONTAINER");
//   console.log("====================================");
//   //   //   // useEffect to handle changes in the result state and toggle isOpen accordingly
//   //   useEffect(() => {
//   //     // Check if there are any results, and toggle isOpen accordingly
//   //     setIsOpen(result && result.length > 0);
//   //   }, [result]);

//   // Set the desired width for each card and the number of cards in a row
//   //   const cardWidthClass = "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"; // Adjust as needed
//   const cardWidthClass = "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4";
//   //   const cardWidthClass = "w-1/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4";
//   // if (result && result.length > 0) {
//   return (
//     <>
//       {/* <div> */}
//       {/* <div class="transition ease-in delay-1000 p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"> */}
//       {/* <div class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"> */}
//       {/* <Transition
//         show={isOpen}
//         enter="transition-opacity duration-1000"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="transition-opacity duration-2500"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       > */}
//       <Transition
//         appear={true}
//         show={isOpen}
//         class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"
//       >
//         {/* <div class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"> */}
//         {result.map((recipe, index) => (
//           <>
//             <Transition.Child
//               //   show={isOpen}
//               //   enter="transition-opacity duration-1000"
//               //   enterFrom="opacity-0"
//               //   enterTo="opacity-100"
//               //   leave="transition-opacity duration-2500"
//               //   leaveFrom="opacity-100"
//               //   leaveTo="opacity-0"
//               // show={isOpen}
//               enter="transition-opacity ease-linear duration-1000"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="transition-opacity ease-linear duration-2500"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <RecipeCard
//                 key={recipe.dish_id}
//                 selected_ingredients={selected_items}
//                 dish={recipe.dish}
//                 ingredients={recipe.ingredients}
//                 quantities={recipe.quantities}
//                 directions={recipe.directions}
//               />
//             </Transition.Child>
//           </>
//         ))}
//         {/* </div> */}
//       </Transition>
//       {/* </Transition> */}
//       {/* </div> */}
//     </>
//   );

//   //   return (
//   //     <>
//   //       <div class="transition ease-in delay-1000 p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
//   //         {/* <div className="flex flex-wrap"> */}
//   //         {/* <div className={`flex flex-wrap ${cardWidthClass}`}> */}
//   //         {result.map((recipe, index) => (
//   //           //   <div key={recipe.dish_id} className="px-2 mb-4">
//   //           //   <div
//   //           //     key={recipe.dish_id}
//   //           //     className="rounded overflow-hidden shadow-lg"
//   //           //   >
//   //           <RecipeCard
//   //             key={recipe.dish_id}
//   //             selected_ingredients={selected_items}
//   //             dish={recipe.dish}
//   //             ingredients={recipe.ingredients}
//   //             quantities={recipe.quantities}
//   //             directions={recipe.directions}
//   //           />
//   //           //   </div>
//   //         ))}
//   //       </div>
//   //       {/* </div> */}
//   //     </>
//   //   );
// }

// export default CardContainer;
// ##################### WORKING AS OF 11/20 PM ####################################
// ##################### WORKING AS OF 11/20 PM ####################################
// // CardContainer.jsx
// import React, { useState } from "react";
// import RecipeCard from "./RecipeCard";

// function CardContainer({ result, selected_items }) {
//   const [activeCardId, setActiveCardId] = useState("");

//   console.log("result: ", result);
//   console.log("RENDER CARD CONTAINER");
//   console.log("====================================");

//   // Set the desired width for each card and the number of cards in a row
//   //   const cardWidthClass = "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"; // Adjust as needed
//   const cardWidthClass = "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4";
//   //   const cardWidthClass = "w-1/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4";
//   // if (result && result.length > 0) {
//   return (
//     <>
//       <div className="flex flex-wrap items-center justify-center p-5">
//         {/* <div className="flex flex-wrap"> */}
//         <div className={`flex flex-wrap ${cardWidthClass}`}>
//           {result.map((recipe, index) => (
//             <div key={recipe.dish_id} className="px-2 mb-4">
//               <RecipeCard
//                 //   key={recipe.dish_id}
//                 selected_ingredients={selected_items}
//                 dish={recipe.dish}
//                 ingredients={recipe.ingredients}
//                 quantities={recipe.quantities}
//                 directions={recipe.directions}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default CardContainer;
