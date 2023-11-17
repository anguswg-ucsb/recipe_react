import React from "react";
import ReactDOM from "react-dom/client";
// import ReactDOM from "react-dom";

// import "./assets/main.css"; // Import your styles
import "./assets/tailwind.css"; // Import your styles

import App from "./App";

import reportWebVitals from "./reportWebVitals";

// import "bootstrap/dist/css/bootstrap.css"; // Import Bootstrap CSS
// import "bulma/css/bulma.css";
// import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
