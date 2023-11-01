import React from "react";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">My Logo</div>
      <div className="nav-section">
        <a href="https://en.wikipedia.org/wiki/Cat">
          <h3>Home</h3>
        </a>
      </div>
      <div className="nav-section">
        <a href="https://en.wikipedia.org/wiki/Cat">
          <h3>About</h3>
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
<a href="https://en.wikipedia.org/wiki/Cat">
  <h3>About</h3>
</a>;
