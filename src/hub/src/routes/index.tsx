// ./routes/Layout.js
import { Route, Switch } from "react-router";
import React from "react";

// A Routes file is a good shared entry-point between client and server
import routes from "./routes";

const Layout = () => (
  <div
    style={{
      height: "100vh",
      width: "100vw"
    }}
  >
    <Switch>
      {routes.map(route => (
        <Route key={route.name} {...route} />
      ))}
    </Switch>
  </div>
);

export default Layout;
