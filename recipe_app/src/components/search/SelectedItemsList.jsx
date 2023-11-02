import React from "react";

function SelectedItemsList({ selected_items, onRemoveItem }) {
  return (
    <div>
      {selected_items.map((item, index) => (
        <div key={item.title} className="selected-item">
          {item.title}
          <button onClick={() => onRemoveItem(index)} className="remove-button">
            X
          </button>
        </div>
      ))}
    </div>
  );
}

export default SelectedItemsList;
