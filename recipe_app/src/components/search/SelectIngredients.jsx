import React from "react";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Async from "react-select/async";
import axios from "axios";
import styles from "./SearchBar.module.css";

const options = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

function SelectIngredients({ defaultOptionValue }) {
  const [value, setValue] = useState();
  const [defaultValue, setDefaultValue] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  //   function loadOptions(searchKey) {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     !defaultValue &&
  //       setDefaultValue(options.find((o) => o.value === defaultOptionValue));

  //     const filtered = options.filter((o) => o.label.includes(searchKey));

  //     resolve(filtered);
  //   }, 2000);
  //     });
  //   }

  async function loadOptions(searchKey) {
    try {
      const { data } = await axios.get(
        `https://dummyjson.com/products/search?q=${searchKey}&limit=3`
      );

      console.log("=========================");
      console.log("suggestions: ", suggestions);
      console.log("=========================");

      setSuggestions(data["products"]);
      //   setValue(data["products"]);
      return new Promise((resolve) => {
        setTimeout(() => {
          //   !defaultValue &&
          //     setDefaultValue(
          //       suggestions.find((o) => o.value === defaultOptionValue)
          //     );
          !defaultValue && setDefaultValue(data["products"]);
          const filtered = suggestions.filter((o) =>
            o.title.includes(searchKey)
          );

          resolve(filtered);
        }, 2000);
      });
    } catch (error) {
      console.error("Error fetching options: ", error);
      return [];
    }
  }

  function onChange(option) {
    setValue(option);
  }

  return (
    <div>
      <h3>
        Async Select with custom <em>defaultOptionValue</em> passed in
      </h3>
      <Async
        loadOptions={loadOptions}
        defaultOptions
        value={value}
        // value={suggestions.map((item) => {
        //   return {
        //     value: item.title,
        //     label: item.title,
        //   };
        // })}
        isMulti
        onChange={onChange}
      />
      <p>
        Waiting 5 seconds to retrieve option with value: {defaultOptionValue}`
      </p>
      {!!defaultValue && <p>Retrieved default option!</p>}
    </div>
  );
}

export default SelectIngredients;
