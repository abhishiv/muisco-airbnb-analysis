import "babel-polyfill";
import * as React from "react";
import { render } from "react-dom";

import WorldMap from "../../../atlas/src/index";

function App() {
  return (
    <div>
      <WorldMap />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
