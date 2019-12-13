// ./routes/Layout.js
import { Route, Switch } from "react-router";
import React from "react";

// A Routes file is a good shared entry-point between client and server
import routes from "./routes";
import styles from "./index.scss";

const Layout = () => (
  <div className={styles.container}>
    <Switch>
      {routes.map(route => {
        return <Route key={route.name} {...route} />;
      })}
    </Switch>
  </div>
);

export default Layout;
