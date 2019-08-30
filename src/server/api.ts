import { Router, Request, Response, NextFunction } from "express";

export const apiRouter: Router = Router();

import airbnbDashboard from "../dashboard/src/definition";
const dashboards: { [key: string]: any } = { airbnb: airbnbDashboard };

apiRouter.get("/:dashboard", async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const dashboardName = req.params.dashboard;
  const dashboard = dashboards[dashboardName];
  res.json(dashboard).status(200);
});

apiRouter.get("/:dashboard/:queryName", async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const dashboardName = req.params.dashboard;
  const dashboard = dashboards[dashboardName];
  const query = dashboard.queries.find(
    (el: any) => el.name == req.params.queryName
  );
  const knex = req.app.get("knex");
  console.log(req.query.variables);
  const variables = req.query.variables || {
    cities: ["milano"],
    roomTypes: ["Shared room", "Entire home/apt"],
    date: ["2014-02-01", "2018-02-01"]
  };
  const queryString = query.computer(variables);

  const data = await knex.raw(queryString);
  res.json({ rows: data.rows, query: queryString }).status(200);
});
export default apiRouter;
