import logo from "./logo.svg";
import "./App.css";
import SearchBar from "./components/search/SearchBar";
import NavBar from "./components/navbar/NavBar";

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
    </>
  );
}

export default App;
