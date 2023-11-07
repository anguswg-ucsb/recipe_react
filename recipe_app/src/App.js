import logo from "./logo.svg";
import "./App.css";
import SearchBar from "./components/search/SearchBar";
import SearchBarWithChips from "./components/search/SearchBarWithChips";
import NavBar from "./components/navbar/NavBar";
import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// function App() {
// const [searchArray, setSearchArray] = useState([]);
//   const [searchArray, setSearchArray] = useState(["SearchBar 1"]);
//   const [selectedList, setSelectedList] = useState([]);

//   // function removeSearchBar(index) {
//   //   const newSearchArray = searchArray.filter((_, i) => i !== index);
//   //   setSearchArray(newSearchArray);
//   // }

//   function removeSearchBar(index) {
//     console.log("index: ", index);
//     console.log("searchArray: ", searchArray);
//     // const newSearchArray = searchArray.filter((item) => item !== index);
//     // setSearchArray(newSearchArray);

//     // const newSearchArray = searchArray.filter((_, i) => i !== index + 1);
//     // console.log("newSearchArray: ", newSearchArray);
//     // setSearchArray(newSearchArray);
//     const newSearchArray = [...searchArray];
//     newSearchArray.splice(index, 1);
//     setSearchArray(newSearchArray);
//   }

//   function addSearchBar(title) {
//     const newSearchArray = [...searchArray, title];
//     setSearchArray(newSearchArray);
//   }
//   function addSelectedItems(item) {
//     console.log("selectedList: ", selectedList);
//     console.log("---> searchArray: ", searchArray);
//     const newSelectedArray = [...selectedList, item];
//     setSelectedList(newSelectedArray);
//   }

//   return (
//     <>
//       <div className="search-bar-container">
//         <div className="search-bar-content">
//           {searchArray.map((value, index) => (
//             <>
//               <SearchBar
//                 key={index}
//                 addSelectedItems={addSelectedItems}
//                 onAddSearchBar={addSearchBar}
//                 // onRemoveSearchBar={removeSearchBar}
//                 onRemoveSearchBar={() => removeSearchBar(index)}
//                 element_index={index}
//               />
//             </>
//           ))}
//         </div>
//         <button className="add-btn" onClick={addSearchBar}>
//           +
//         </button>
//       </div>
//     </>
//   );
// }

// export default App;
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

function App() {
  return (
    <>
      <SearchBarWithChips />
    </>
  );
  // return (
  //   <>
  //     <div className="search-bar-container">
  //       <div tabIndex={0} className="search-bar-content">
  //         <>
  //           <SearchBarWithChips />
  //         </>
  //       </div>
  //     </div>
  //   </>
  // );
}

export default App;
