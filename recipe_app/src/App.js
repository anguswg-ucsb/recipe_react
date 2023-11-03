import logo from "./logo.svg";
import "./App.css";
import SearchBar from "./components/search/SearchBar";
import NavBar from "./components/navbar/NavBar";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import SelectIngredients from "./components/search/SelectIngredients";

const aquaticCreatures = [
  { label: "Shark", value: "Shark" },
  { label: "Dolphin", value: "Dolphin" },
  { label: "Whale", value: "Whale" },
  { label: "Octopus", value: "Octopus" },
  { label: "Crab", value: "Crab" },
  { label: "Lobster", value: "Lobster" },
];

function App() {
  return (
    <>
      <NavBar />
      <div className="App">
        <header className="App-header">
          <h1>Recipe App</h1>
        </header>
        <SearchBar />
      </div>
      <div>
        <Select options={aquaticCreatures} isMulti />
      </div>
      <div>
        <SelectIngredients />
      </div>
    </>
  );
}

export default App;
