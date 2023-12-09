// // import React stuff
import React from "react";
// import { useState } from "react";

// // Components
import SearchBarWithChips from "./components/search/SearchBarWithChips";
import ComboBoxSearch from "./components/search/ComboBoxSearch";
import SearchWithSuggestions from "./components/search/SearchWithSuggestions";
import SearchBarWithPills from "./components/search/SearchBarWithPills";
import SearchBarContainer from "./components/search/SearchBarContainer";
// import NavBar from "./components/navbar/NavBar";

// import "bulma/css/bulma.min.css"; // Import Bulma styles
// import "./App.css";
// import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// import ResultGrid from "./components/search/ResultGrid";

function App() {
  return (
    <>
      {/* <ComboBoxSearch /> */}
      {/* <SearchBarWithChips /> */}
      {/* <SearchWithSuggestions /> */}
      {/* <SearchBarWithPills /> */}
      <SearchBarContainer />
    </>
  );
}
{
  /* <ResultGrid cardData={cardsData} /> 
    <SearchBarWithChips />  */
}
export default App;
