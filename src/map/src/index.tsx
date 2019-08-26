import * as React from "react";
import { render } from "react-dom";

import WorldMap from "./map";

function App() {
  return (
    <div >
      <WorldMap />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
