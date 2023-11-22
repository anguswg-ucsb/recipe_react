// RecipeCard.jsx
import React, { useState } from "react";
// import styles from "./SearchBar.module.css";
// import customStyles from "./styles/custom-bulma.css";

// example data
let recipe_data = [
  {
    dish_id: 1,
    dish: "Chicken Parmesan",
    ingredients: ["chicken", "tomato sauce", "mozzarella cheese"],
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
];
const RecipeCard = ({
  selected_ingredients,
  dish,
  ingredients,
  quantities,
  directions,
  percent_match,
}) => {
  // const title = recipe.dish;
  // const ingredients = recipe.ingredients;
  console.log("===== RECIPE CARD ====");
  console.log("dish: ", dish);
  console.log("ingredients: ", ingredients);
  console.log("quantities: ", quantities);
  console.log("directions: ", directions);
  console.log("percent_match: ", percent_match);
  console.log("================");

  const [activeTab, setActiveTab] = useState("ingredients");
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   // Set visible to true after the component has mounted
  //   setVisible(true);
  // }, []);

  // const displayIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);
  //
  function handleTabChange(tab) {
    setActiveTab(tab);
  }
  // className={`border m-1 ${
  //   selected_ingredients.includes(ingredient) ? "bg-green-200" : "bg-red-200"
  // }`}
  function renderTabContent() {
    switch (activeTab) {
      case "ingredients":
        return ingredients.map((ingredient, index) => (
          // <li key={index}>{ingredient}</li>
          <div
            key={index}
            className={`border m-1 p-1 rounded-md ${
              selected_ingredients.includes(ingredient)
                ? "bg-green-200"
                : "bg-red-100"
            }`}
          >
            {ingredient}
          </div>
        ));
      case "quantities":
        return quantities.map((quantity, index) => (
          // <li key={index}>{quantity}</li>
          <div key={index} className="border m-1 p-1 bg-slate-50 rounded-md">
            <span className="font-bold">{index + 1}:</span> {quantity}
          </div>
        ));
      case "directions":
        return directions.map((direction, index) => (
          // <li key={index}>{direction}</li>
          <div key={index} className="border m-1 p-1 bg-slate-50 rounded-md">
            <span className="font-bold">Step {index + 1}: </span> {direction}
          </div>
        ));
      default:
        return null;
    }
  }
  //   <ul>
  //   <li className={activeTab === "ingredients" ? "is-active" : ""}>
  //     <a onClick={() => handleTabChange("ingredients")}>
  //       <span>Ingredients</span>
  //     </a>
  //   </li>
  //   <li className={activeTab === "quantities" ? "is-active" : ""}>
  //     <a onClick={() => handleTabChange("quantities")}>
  //       <span>Quantities</span>
  //     </a>
  //   </li>
  //   <li className={activeTab === "directions" ? "is-active" : ""}>
  //     <a onClick={() => handleTabChange("directions")}>
  //       <span>Directions</span>
  //     </a>
  //   </li>
  // </ul>
  // console.log("title", title);
  // console.log("ingredients", ingredients);

  // className={`justify-center p-1 ${
  //   activeTab === "ingredients" ? "flex flex-wrap" : "flex flex-col"
  // }`}
  //     <div className="flex-1 text-xs justify-center content-center items-center">
  //       {/* <div className="flex flex-wrap justify-center p-1"> */}
  // <div
  //   className={`justify-center p-1 ${
  //     activeTab === "ingredients" ? "flex flex-wrap" : "flex flex-col"
  //   }`}
  // >
  //         {renderTabContent()}
  //       </div>
  //     </div>

  return (
    // <div className="flex flex-1 flex-col justify-between rounded overflow-hidden shadow-lg">
    <div className="transition ease-in delay-1000 rounded relative overflow-hidden shadow-lg">
      <header className="flex justify-center text-center text-sm bg-yellow-200 py-2 px-4">
        <p className="font-semibold text-gray-800">{dish}</p>
      </header>
      <div className="px-6 pt-4">
        <div
          className={`justify-center p-1 m-1 ${
            activeTab === "ingredients" ? "flex flex-wrap" : "flex flex-col"
          }`}
        >
          {renderTabContent()}
        </div>
      </div>
      {/* <div className="flex flex-1 flex-col justify-between"> */}
      <div className="absolute bottom-0 w-full">
        <ul className="flex flex-row text-xs font-medium rounded-full text-center object-contain text-gray-500 divide-x divide-gray-200">
          <li className="flex-1">
            <button
              type="button"
              role="tab"
              aria-controls="ingredients"
              aria-selected={activeTab === "ingredients"}
              className={`inline-block w-full p-4 rounded-ss-lg ${
                activeTab === "ingredients"
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("ingredients")}
            >
              Ingredients
            </button>
          </li>
          <li className="flex-1">
            <button
              type="button"
              role="tab"
              aria-controls="quantities"
              aria-selected={activeTab === "quantities"}
              className={`inline-block w-full p-4 ${
                activeTab === "quantities"
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("quantities")}
            >
              Quantities
            </button>
          </li>
          <li className="flex-1">
            <button
              type="button"
              role="tab"
              aria-controls="directions"
              aria-selected={activeTab === "directions"}
              className={`inline-block w-full p-4 rounded-se-lg ${
                activeTab === "directions"
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("directions")}
            >
              Directions
            </button>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </div>
  );

  // return (
  //   <div className="flex-col w-full mx-auto bg-white border border-gray-200 rounded-lg shadow">
  //     {/* <header className="flex text-sm bg-yellow-200 py-2 px-4 mb-2 rounded-t-md"> */}
  //     {/* <header className="flex text-sm bg-yellow-200 py-2 px-4 rounded-t-md"> */}
  //     <header className="flex justify-center text-center text-sm bg-yellow-200 py-2 px-4">
  //       <p className="font-semibold text-gray-800">{dish}</p>
  //     </header>
  //     {/* <div className="border-t border-gray-200"> */}
  //     <div className="flex text-xs justify-center content-center items-center">
  //       <div
  //         className={`justify-center p-1 ${
  //           activeTab === "ingredients" ? "flex flex-wrap" : "flex flex-col"
  //         }`}
  //       >
  //         {renderTabContent()}
  //       </div>
  //     </div>
  //     <div className="sm:hidden">
  //       <label htmlFor="tabs" className="sr-only">
  //         Select tab
  //       </label>
  //       <select
  //         id="tabs"
  //         className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //         onChange={(e) => handleTabChange(e.target.value)}
  //       >
  //         <option value="ingredients">Ingredients</option>
  //         <option value="quantities">Quantities</option>
  //         <option value="directions">Directions</option>
  //       </select>
  //     </div>
  //     <ul className="flex flex-row hidden text-xs font-medium text-center object-contain text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex">
  //       <li className="w-full">
  //         <button
  //           type="button"
  //           role="tab"
  //           aria-controls="ingredients"
  //           aria-selected={activeTab === "ingredients"}
  //           // className={`text-sm p-2 cursor-pointer text-gray-800 ${
  //           //   activeTab === "ingredients"
  //           //     ? "bg-blue-200 text-gray-800 rounded-sm"
  //           //     : ""
  //           // }`}
  //           // className={`text-sm p-2 cursor-pointer text-gray-800 ${
  //           //   activeTab === "ingredients"
  //           //     ? "bg-gray-50 hover:bg-gray-100"
  //           //     : "bg-white hover:bg-gray-50"
  //           //   }`}
  //           className={`inline-block w-full p-4 rounded-ss-lg ${
  //             activeTab === "ingredients"
  //               ? "bg-gray-50 hover:bg-gray-100"
  //               : "bg-white hover:bg-gray-50"
  //           }`}
  //           onClick={() => handleTabChange("ingredients")}
  //         >
  //           Ingredients
  //         </button>
  //       </li>
  //       <li className="w-full">
  //         <button
  //           type="button"
  //           role="tab"
  //           aria-controls="quantities"
  //           aria-selected={activeTab === "quantities"}
  //           className={`inline-block w-full p-4 ${
  //             activeTab === "quantities"
  //               ? "bg-gray-50 hover:bg-gray-100"
  //               : "bg-white hover:bg-gray-50"
  //           }`}
  //           onClick={() => handleTabChange("quantities")}
  //         >
  //           Quantities
  //         </button>
  //       </li>
  //       <li className="w-full">
  //         <button
  //           type="button"
  //           role="tab"
  //           aria-controls="directions"
  //           aria-selected={activeTab === "directions"}
  //           className={`inline-block w-full p-4 rounded-se-lg ${
  //             activeTab === "directions"
  //               ? "bg-gray-50 hover:bg-gray-100"
  //               : "bg-white hover:bg-gray-50"
  //           }`}
  //           onClick={() => handleTabChange("directions")}
  //         >
  //           Directions
  //         </button>
  //       </li>
  //     </ul>
  //   </div>
  // );
  // return (
  //   <div className="flex flex-col justify-center content-center items-center bg-white rounded-md shadow-md p-4">
  // <header className="flex text-sm bg-yellow-200 py-2 px-4 mb-2 rounded-t-md">
  //   <p className="font-semibold text-gray-800">{dish}</p>
  // </header>
  //     <div className="flex-1 text-xs justify-center content-center items-center">
  //       {/* <div className="flex flex-wrap justify-center p-1"> */}
  //       <div
  //         className={`justify-center p-1 ${
  //           activeTab === "ingredients" ? "flex flex-wrap" : "flex flex-col"
  //         }`}
  //       >
  //         {renderTabContent()}
  //       </div>
  //     </div>
  //     <div className="flex-1 flex-row p-3 object-contain justify-evenly items-center content-between border">
  //       <a
  //         className={`text-sm p-2 cursor-pointer text-gray-800 ${
  //           activeTab === "ingredients"
  //             ? "bg-blue-200 text-gray-800 rounded-sm"
  //             : ""
  //         }`}
  //         onClick={() => handleTabChange("ingredients")}
  //       >
  //         Ingreds
  //       </a>
  //       <a
  //         className={`text-sm p-2 cursor-pointer text-gray-800 ${
  //           activeTab === "quantities"
  //             ? "bg-blue-200 text-gray-800 rounded-sm"
  //             : ""
  //         }`}
  //         onClick={() => handleTabChange("quantities")}
  //       >
  //         Quants
  //       </a>
  //       <a
  //         className={`text-sm p-2 cursor-pointer text-gray-800 ${
  //           activeTab === "directions"
  //             ? "bg-blue-200 text-gray-800 rounded-sm"
  //             : ""
  //         }`}
  //         onClick={() => handleTabChange("directions")}
  //       >
  //         Directs
  //       </a>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="card">
  //     <header className="card-header text-sm bg-warning">
  //       <p className="card-header-title">{dish}</p>
  //     </header>
  //     <div className="card-content text-xs">
  //       <div className="content">{renderTabContent()}</div>
  //     </div>
  //     <footer className="card-footer">
  //       <a
  //         // class="card-footer-item"
  //         // className={`${styles["card-footer-item"]} ${
  //         //   activeTab === "ingredients" ? styles["is-active"] : ""
  //         // }`}

  //         className={`card-footer-item ${
  //           activeTab === "ingredients" ? "is-active" : ""
  //         }`}
  //         onClick={() => handleTabChange("ingredients")}
  //       >
  //         Ingreds
  //       </a>
  //       <a
  //         // class="card-footer-item"
  //         className={`card-footer-item ${
  //           activeTab === "quantities" ? "is-active" : ""
  //         }`}
  //         // className={`${styles["card-footer-item"]} ${
  //         //   activeTab === "quantities" ? styles["is-active"] : ""
  //         // }`}
  //         onClick={() => handleTabChange("quantities")}
  //       >
  //         Quants
  //       </a>
  //       <a
  //         // class="card-footer-item"
  //         // className={`${styles["card-footer-item"]} ${
  //         //   activeTab === "directions" ? styles["is-active"] : ""
  //         // }`}
  //         className={`card-footer-item ${
  //           activeTab === "directions" ? "is-active" : ""
  //         }`}
  //         onClick={() => handleTabChange("directions")}
  //       >
  //         Directs
  //       </a>
  //     </footer>
  //   </div>
  // );
};

export default RecipeCard;

// // RecipeCard.jsx
// import React, { useState } from "react";
// import styles from "./SearchBar.module.css";
// // import customStyles from "./styles/custom-bulma.css";

// // example data
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
// const RecipeCard = ({ dish, ingredients, quantities, directions }) => {
//   // const title = recipe.dish;
//   // const ingredients = recipe.ingredients;
//   console.log("===== RECIPE CARD ====");
//   console.log("dish: ", dish);
//   console.log("ingredients: ", ingredients);

//   const [activeTab, setActiveTab] = useState("ingredients");
//   // const [isExpanded, setIsExpanded] = useState(false);

//   // const displayIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);
//   //
//   function handleTabChange(tab) {
//     setActiveTab(tab);
//   }

//   function renderTabContent() {
//     switch (activeTab) {
//       case "ingredients":
//         return ingredients.map((ingredient, index) => (
//           <li key={index}>{ingredient}</li>
//         ));
//       case "quantities":
//         return quantities.map((quantity, index) => (
//           <li key={index}>{quantity}</li>
//         ));
//       case "directions":
//         return directions.map((direction, index) => (
//           <li key={index}>{direction}</li>
//         ));
//       default:
//         return null;
//     }
//   }
//   //   <ul>
//   //   <li className={activeTab === "ingredients" ? "is-active" : ""}>
//   //     <a onClick={() => handleTabChange("ingredients")}>
//   //       <span>Ingredients</span>
//   //     </a>
//   //   </li>
//   //   <li className={activeTab === "quantities" ? "is-active" : ""}>
//   //     <a onClick={() => handleTabChange("quantities")}>
//   //       <span>Quantities</span>
//   //     </a>
//   //   </li>
//   //   <li className={activeTab === "directions" ? "is-active" : ""}>
//   //     <a onClick={() => handleTabChange("directions")}>
//   //       <span>Directions</span>
//   //     </a>
//   //   </li>
//   // </ul>
//   // console.log("title", title);
//   // console.log("ingredients", ingredients);
//   return (
//     <div class={styles["card"]}>
//       <header
//         className={styles["card-header is-size-6 has-background-warning"]}
//       >
//         <p className={styles["card-header-title"]}>{dish}</p>
//       </header>
//       <div className="card-content is-size-7">
//         <div className="content">{renderTabContent()}</div>
//       </div>
//       <footer class="card-footer">
//         <a
//           // class="card-footer-item"
// className={`${styles["card-footer-item"]} ${
//   activeTab === "ingredients" ? styles["is-active"] : ""
// }`}
//           onClick={() => handleTabChange("ingredients")}
//         >
//           Ingreds
//         </a>
//         <a
//           // class="card-footer-item"
//           className={`${styles["card-footer-item"]} ${
//             activeTab === "quantities" ? styles["is-active"] : ""
//           }`}
//           onClick={() => handleTabChange("quantities")}
//         >
//           Quants
//         </a>
//         <a
//           // class="card-footer-item"
//           className={`${styles["card-footer-item"]} ${
//             activeTab === "directions" ? styles["is-active"] : ""
//           }`}
//           onClick={() => handleTabChange("directions")}
//         >
//           Directs
//         </a>
//       </footer>
//     </div>
//   );
// };

// export default RecipeCard;

// const RecipeCard = ({ dish, ingredients, quantities, directions }) => {
//   // const title = recipe.dish;
//   // const ingredients = recipe.ingredients;
//   console.log("===== RECIPE CARD ====");
//   console.log("dish: ", dish);
//   console.log("ingredients: ", ingredients);

// const [isExpanded, setIsExpanded] = useState(false);

// const displayIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);

//   // console.log("title", title);
//   // console.log("ingredients", ingredients);
//   return (
//     <div class="card">
//       <header class="card-header is-size-6 has-background-warning">
//         <p class="card-header-title">{dish}</p>
//         <button class="card-header-icon" aria-label="more options">
//           <span class="icon">
//             <i class="fas fa-angle-down" aria-hidden="true"></i>
//           </span>
//         </button>
//       </header>
//       <div class="card-content is-size-7">
//         <div class="content">
//           {displayIngredients.map((ingredient, index) => (
//             <li key={index}>{ingredient}</li>
//           ))}
//           {ingredients.length > 5 && (
//             <button
//               class="button is-light is-small is-centered"
//               onClick={() => setIsExpanded(!isExpanded)}
//             >
//               {isExpanded ? "^" : "..."}
//             </button>
//           )}
//         </div>
//       </div>
//       <footer class="card-footer">
//         <a href="#" class="card-footer-item">
//           Recipe
//         </a>
//         <a href="#" class="card-footer-item">
//           Eat
//         </a>
//       </footer>
//     </div>
//   );
// };

// export default RecipeCard;

// const RecipeCard = ({ recipe }) => {
//   // const items = [
//   //   { id: 1, name: 'Item 1' },
//   //   { id: 2, name: 'Item 2' },
//   //   { id: 3, name: 'Item 3' },
//   //   // ... more items
//   // ];
//   // const title = recipe.dish;
//   // const ingredients = recipe.ingredients;
//   console.log("===== RECIPE CARD ====");
//   console.log("recipe: ", recipe);
//   // console.log("title", title);
//   // console.log("ingredients", ingredients);
//   return (
//     <div>
//       <Row>
//         {recipe.map((item, index) => (
//           <Col key={index} sm={6} md={4} lg={3}>
//             {/* Adjust the grid size based on your requirements */}
//             <div>
//               {/* Your content for each item goes here */}
//               <p>{item.dish}</p>
//               <p>{item.ingredients}</p>
//             </div>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// const RecipeCard = ({ recipe }) => {
//   if (!recipe || !recipe.ingredients) {
//     return null; // or handle the case when ingredients are missing
//   }

//   const title = recipe.dish;
//   const ingredients = recipe.ingredients;
//   console.log("===== RECIPE CARD ====");
//   console.log("recipe: ", recipe);
//   console.log("title", title);
//   console.log("ingredients", ingredients);

//   // return (
//   //   <Card className={styles["recipe-card"]}>
//   //     <Card.Img variant="top" src={recipe.thumbnail} alt={recipe.thumbnail} />
//   //     <Card.Body>
//   //       <Card.Title>{recipe.title}</Card.Title>
//   //       <Card.Text>{recipe.ingredients}</Card.Text>
//   //     </Card.Body>
//   //   </Card>
//   // );

//   return (
//     <Card style={{ width: "10rem" }}>
//       <Card.Body>
//         <Card.Title>{title}</Card.Title>
//         <Card.Text>{ingredients}</Card.Text>
//       </Card.Body>
//     </Card>
//   );
// };

// // const RecipeCard = ({ recipe }) => {
//   // if (!recipe || !recipe.ingredients) {
//   //   return null; // or handle the case when ingredients are missing
//   // }
// const title = recipe.dish;
// const ingredients = recipe.ingredients;
// console.log("===== RECIPE CARD ====");
// console.log("recipe: ", recipe);
// console.log("title", title);
// console.log("ingredients", ingredients);
//   // const { title, ingredients } = recipe;

//   return (
//     <div className={styles["recipe-card"]}>
//       <h3>{title}</h3>
//       <ul>
//         {ingredients.map((ingredient, index) => (
//           <li key={index}>{ingredient}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RecipeCard;
// // RecipeCard.jsx
// import React from "react";

// const RecipeCard = ({ recipe }) => {
//   const { title, ingredients } = recipe;

//   return (
//     <div>
//       <h3>{title}</h3>
//       <ul>
//         {ingredients.map((ingredient, index) => (
//           <li key={index}>{ingredient}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RecipeCard;
// // RecipeCard.jsx
// import React from 'react';

// const RecipeCard = ({ recipe }) => {
//   return (
//     <div>
//       <h3>{recipe.title}</h3>
//       <p>{recipe.description}</p>
//       {/* Add more details as needed */}
//     </div>
//   );
// };

// export default RecipeCard;
// // React component for the search bar with chips
// import React, { useState, useEffect, useRef } from "react";
// import { useDebounce } from "../../hooks/useDebounce";
// import axios from "axios";
// import styles from "./SearchBar.module.css";

// function RecipeCard({ product_id }) {
//   const [result, setResult] = useState([]);
//   // delay search query until 1 second after user stops typing
//   useDebounce(
//     () => {
//       const fetchData = async () => {
//         try {
//           console.log("Looking up product product_id: ", product_id);
//           console.log(
//             "product product_id url: ",
//             `https://dummyjson.com/products/${product_id}`
//           );

//           const { data } = await axios.get(
//             `https://dummyjson.com/products/${product_id}`
//           );

//           console.log("result: ", result);
//           console.log("data: ", data);
//           // console.log("data['products']: ", data["products"]);

//           // set the results array to response data
//           setResult(data);

//           //   setSuggestions(data["products"]);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       if (product_id) {
//         fetchData();
//       }
//       //   fetchData();
//     },
//     1000,
//     [product_id, result]
//   );

//   return (
//     <div className={styles["recipe-card"]}>
//       <div>{result}</div>
//       <img src={result["thumbnail"]} alt={result["thumbnail"]} />
//       <h1>{result["title"]}</h1>
//       <h2>{result["description"]}</h2>
//     </div>
//   );
// }

// export default RecipeCard;
