import React from "react";
import styles from "./SearchBar.module.css";

const categories = ["title", "description", "price", "rating", "category"];

function SearchResult(props) {
  console.log("props: ", props);
  return (
    <>
      {categories.map((i) => (
        <div>
          {i[0].toUpperCase() + i.slice(1)}: {props[i]}
        </div>
      ))}
    </>
  );
}

export default SearchResult;
