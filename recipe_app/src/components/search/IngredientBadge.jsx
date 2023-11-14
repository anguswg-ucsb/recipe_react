import React from "react";
import styles from "./SearchBar.module.css";

function IngredientBadge({ item, onDeleteClick, onClick, clearSearch }) {
  return (
    <div className={styles["ingredient-badge"]}>
      <span>{item}</span>
      <button
        onClick={(event) => {
          event.stopPropagation();
          onDeleteClick();
          clearSearch();
        }}
      >
        &times;
      </button>
    </div>
  );
}

export default IngredientBadge;
