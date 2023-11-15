// RecipeCard.jsx
import React from "react";
import styles from "./SearchBar.module.css";

// import Grid from "react-bootstrap/Grid";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// import { Row, Col } from 'react-bootstrap';

const RecipeCardGrid = ({ recipe }) => {
  // const items = [
  //   { id: 1, name: 'Item 1' },
  //   { id: 2, name: 'Item 2' },
  //   { id: 3, name: 'Item 3' },
  //   // ... more items
  // ];
  // const title = recipe.dish;
  // const ingredients = recipe.ingredients;
  console.log("===== RECIPE CARD ====");
  console.log("recipe: ", recipe);
  // console.log("title", title);
  // console.log("ingredients", ingredients);
  // return (
  //   <div>
  //     <Row>
  //       {recipe.map((item, index) => (
  //         <Col key={index} sm={6} md={4} lg={3}>
  //           {/* Adjust the grid size based on your requirements */}
  //           <div>
  //             {/* Your content for each item goes here */}
  //             <p>{item.dish}</p>
  //             <p>{item.ingredients}</p>
  //           </div>
  //         </Col>
  //       ))}
  //     </Row>
  //   </div>
  // );
};

export default RecipeCardGrid;
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
