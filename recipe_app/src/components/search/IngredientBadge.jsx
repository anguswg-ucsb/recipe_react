import React from "react";
import "bulma/css/bulma.min.css"; // Import Bulma styles
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
