// React component for the search bar with chips
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import styles from "./SearchBar.module.css";

function RecipeCard({ product_id }) {
  const [result, setResult] = useState([]);
  // delay search query until 1 second after user stops typing
  useDebounce(
    () => {
      const fetchData = async () => {
        try {
          console.log("Looking up product product_id: ", product_id);
          console.log(
            "product product_id url: ",
            `https://dummyjson.com/products/${product_id}`
          );

          const { data } = await axios.get(
            `https://dummyjson.com/products/${product_id}`
          );

          console.log("result: ", result);
          console.log("data: ", data);
          // console.log("data['products']: ", data["products"]);

          // set the results array to response data
          setResult(data);

          //   setSuggestions(data["products"]);
        } catch (error) {
          console.log(error);
        }
      };
      if (product_id) {
        fetchData();
      }
      //   fetchData();
    },
    1000,
    [product_id, result]
  );

  return (
    <div className={styles["recipe-card"]}>
      <div>{result}</div>
      <img src={result["thumbnail"]} alt={result["thumbnail"]} />
      <h1>{result["title"]}</h1>
      <h2>{result["description"]}</h2>
    </div>
  );
}

export default RecipeCard;
