import logo from "./logo.svg";
import "./App.css";
import SearchBar from "./components/search/SearchBar";
import NavBar from "./components/navbar/NavBar";
import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // const [searchArray, setSearchArray] = useState([]);
  const [searchArray, setSearchArray] = useState(["SearchBar 1"]);
  const [selectedList, setSelectedList] = useState([]);

  function removeSearchBar(index) {
    const newSearchArray = searchArray.filter((_, i) => i !== index);
    setSearchArray(newSearchArray);
  }

  // function addSearchBar() {
  //   console.log("ADDING NEW SEARCH ARRAY");
  //   console.log("---> searchArray: ", searchArray);

  //   const newSearchArray = [
  //     ...searchArray,
  //     `SearchBar ${searchArray.length + 1}`,
  //   ];

  //   setSearchArray(newSearchArray);
  // }
  function addSearchBar(title) {
    const newSearchArray = [...searchArray, title];
    setSearchArray(newSearchArray);
  }
  function handleCallback(childData) {
    console.log("selectedList: ", selectedList);
    const newSelectedArray = [...selectedList, childData];
    setSelectedList(newSelectedArray);
  }

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar-content">
          {/* <SearchBar key="Start SearchBar" /> */}
          {searchArray.map((value, index) => (
            <>
              <SearchBar
                key={index}
                parentCallback={handleCallback}
                onAddSearchBar={addSearchBar}
                onRemoveSearchBar={() => removeSearchBar(index)}
              />
            </>
          ))}
          <button className="add-btn" onClick={addSearchBar}>
            +
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
