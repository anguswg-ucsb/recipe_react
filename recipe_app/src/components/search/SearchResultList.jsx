import React from "react";
import styles from "./SearchBar.module.css";

const categories = ["title", "description", "price", "rating", "category"];

function SearchResultList(props) {
  console.log("props: ", props);
  return (
    <ul className={styles.resultList}>
      {categories.map((i) => (
        <li key={i} id={i}>
          <strong>{i[0].toUpperCase() + i.slice(1)}:</strong> {props[i]}
        </li>
      ))}
    </ul>
  );
}

export default SearchResultList;
