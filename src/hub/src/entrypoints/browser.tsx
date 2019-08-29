import "babel-polyfill";
import * as React from "react";
import { render } from "react-dom";
import boot from "../kernel";

import WorldMap from "../../../atlas/src/index";

function App() {
  return (
    <div>
      <WorldMap />
    </div>
  );
}

(async () => {
  await boot();
  const rootElement = document.getElementById("root");
  render(<App />, rootElement);
})();
