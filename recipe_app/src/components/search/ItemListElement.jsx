import React from "react";

function ItemListElement({ item, onRemoveItem }) {
  return (
    <div className="selected-item">
      {item.title}
      <button onClick={onRemoveItem} className="remove-button">
        X
      </button>
    </div>
  );
}

export default ItemListElement;
