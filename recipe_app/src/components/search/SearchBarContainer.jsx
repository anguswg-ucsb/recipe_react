import React, { useState } from "react";

import SearchBarWithPills from "./SearchBarWithPills";

function SearchBarContainer() {
  return (
    // <div className="flex flex-col items-center">
    <div class="bg-gray-500/100">
      {/* <div class="bg-gray-500"> */}
      <SearchBarWithPills />
    </div>
  );
}
// function SearchBarContainer() {
//   return <SearchBarWithPills />;
// }
export default SearchBarContainer;
