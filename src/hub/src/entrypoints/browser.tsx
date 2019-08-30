import "babel-polyfill";
import React from "react";
import { render } from "react-dom";

//import WorldMap from "../../../atlas/src/index";
import Dashboard from "../../../dashboard/src/index";

function App() {
  return (
    <React.Fragment>
      <Dashboard />
    </React.Fragment>
  );
}

(async () => {
  //await boot();
  const rootElement = document.getElementById("root");
  render(<App />, rootElement);
})();
