// ./routes/index.js
import Dashboard from "./dashboard";
import Home from "./home";

const routes = [
  {
    path: "/",
    name: "home",
    exact: true,
    component: Home
  },
  {
    path: "/works/airbnb-analysis/:cityName",
    name: "dashboard",
    component: Dashboard,
    exact: false
  }
];

export default routes;
