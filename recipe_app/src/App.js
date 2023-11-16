// import React from "react";
// const App = () => {
//   return (
// <div className="container">
//   <h1 className="title has-text-centered">Welcome to My App</h1>
//   <div className="notification is-primary">
//     This is a primary notification
//   </div>
// </div>
//   );
// };
// export default App;
// // import logo from "./logo.svg";
import "bulma/css/bulma.min.css"; // Import Bulma styles
// import "./App.css";
// import SearchBar from "./components/search/SearchBar";
import SearchBarWithChips from "./components/search/SearchBarWithChips";
import NavBar from "./components/navbar/NavBar";
import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

import ResultGrid from "./components/search/ResultGrid";

function App({ cardsData }) {
  return (
    <>
      {/* <ResultGrid cardData={cardsData} /> */}
      <SearchBarWithChips />
    </>
  );
}

export default App;

// #########################################
// function App() {
//   const [searchArray, setSearchArray] = useState([]);
//   // const [searchArray, setSearchArray] = useState(["SearchBar 1"]);
//   const [selectedList, setSelectedList] = useState([]);

//   function removeSearchBar(index) {
//     const newSearchArray = searchArray.filter((_, i) => i !== index);
//     setSearchArray(newSearchArray);
//   }

//   function addSearchBar(title) {
//     const newSearchArray = [...searchArray, title];
//     setSearchArray(newSearchArray);
//   }
//   function addSelectedItems(item) {
//     console.log("selectedList: ", selectedList);
//     const newSelectedArray = [...selectedList, item];
//     setSelectedList(newSelectedArray);
//   }

//   return (
//     <>
//       <div className="search-bar-container">
//         <div className="search-bar-content">
//           {/* <SearchBar key="Start SearchBar" /> */}
//           {searchArray.map((value, index) => (
//             <>
//               <SearchBar
//                 key={index}
//                 addSelectedItems={addSelectedItems}
//                 onAddSearchBar={addSearchBar}
//                 onRemoveSearchBar={() => removeSearchBar(index)}
//               />
//             </>
//           ))}
//           <button className="add-btn" onClick={addSearchBar}>
//             +
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
