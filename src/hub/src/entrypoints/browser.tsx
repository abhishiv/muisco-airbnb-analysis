import "babel-polyfill";
import * as React from "react";
import { render } from "react-dom";

//import WorldMap from "../../../atlas/src/index";
import Dashboard from "../../../dashboard/src/index";

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

(async () => {
  //await boot();
  const rootElement = document.getElementById("root");
  render(<App />, rootElement);
})();
