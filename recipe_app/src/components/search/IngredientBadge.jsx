import React from "react";

function IngredientBadge({ item, onDeleteClick, onClick, clearSearch }) {
  return (
    // <div className="flex items-center p-1 border border-gray-300 rounded bg-gray-200 overflow-ellipsis w-auto box-border">
    // <div className="flex items-center p-1 m-1 border border-gray-300 rounded bg-gray-200">
    // <div className="flex flex-wrap items-center p-1 m-1 border border-gray-300 rounded bg-gray-200 overflow-ellipsis whitespace-nowrap overflow-hidden">
    <div className="flex flex-wrap items-center p-1 m-1 border border-gray-300 rounded bg-gray-200 overflow-ellipsis whitespace-nowrap overflow-hidden">
      <span className="flex-grow overflow-ellipsis whitespace-nowrap overflow-hidden p-1">
        {item}
      </span>
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

// import React from "react";
// import "bulma/css/bulma.min.css"; // Import Bulma styles
// import styles from "./SearchBar.module.css";

// function IngredientBadge({ item, onDeleteClick, onClick, clearSearch }) {
//   return (
//     <div className={styles["ingredient-badge"]}>
//       <span>{item}</span>
//       <button
//         onClick={(event) => {
//           event.stopPropagation();
//           onDeleteClick();
//           clearSearch();
//         }}
//       >
//         &times;
//       </button>
//     </div>
//   );
// }

// export default IngredientBadge;
