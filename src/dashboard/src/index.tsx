import React, { useState, useEffect } from "react";

import { withSize } from "react-sizeme";

import {
  Dashboard,
  DashboardQueryVariables,
  DashboardMap,
  DashboardProjectionParams,
  DashboardData
} from "../specs/index";
import Layout from "./components/layout/index";
//import { GeoProjection } from "d3-geo";
import { geoMercator, geoPath } from "d3-geo";

export async function fetchDashboard(): Promise<Dashboard> {
  const req = await fetch("/_api/airbnb");
  const json = await req.json();
  return json as Dashboard;
}
export interface DashboardViewProps {
  size: { width: number; height: number };
}

export async function getRealData(map: DashboardMap) {
  const req = await fetch("_api/airbnb/diced");
  const json = await req.json();
  return json.rows;
}

export function DashboardView(props: DashboardViewProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [
    dashboardQueryVariables,
    setDashboardQueryVariables
  ] = useState<DashboardQueryVariables | null>(null);
  const { width, height } = props.size || {};
  const [dashboardProjectionParams, setDashboardProjectionParams] = useState<
    DashboardProjectionParams
  >({
    scale: 1,
    translate: [0, 0]
  });
  const [dashboardMap, setDashboardMap] = useState<DashboardMap | null>(null);
  const [dashboardData, setDashbordData] = useState<DashboardData | null>(null);
  const doAsyncAction = async () => {
    const dashboard = await fetchDashboard();
    if (dashboard.defaultQueryVariables) {
      const dashboardQueryVariables = dashboard.defaultQueryVariables;
      setDashboard(dashboard);
      setDashboardQueryVariables(dashboardQueryVariables);
      const city = dashboard.cities.find(
        el => el.name === dashboardQueryVariables.cityName
      );
      if (city) {
        const geoReq = await fetch(city.geojson);
        const geojson = await geoReq.json();
        const dashboardMap = {
          geojson,
          city: city.name
        };
        setDashboardMap(dashboardMap);
        const dashboardData = await getRealData(dashboardMap);
        setDashbordData({ payload: dashboardData });

        const projection = geoMercator()
          .scale(dashboardProjectionParams.scale / (Math.PI * 2))
          .translate(dashboardProjectionParams.translate);
        const path = geoPath(projection);
        let bounds = path.bounds(geojson);

        const dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = 0.9 / Math.max(dx / width, dy / height),
          translate: [number, number] = [
            width / 2 - scale * x,
            height / 2 - scale * y
          ];

        const p = geoMercator()
          .scale(scale / (Math.PI * 2))
          .translate(translate)
          .fitSize([width - 200, height - 100], geojson);

        setDashboardProjectionParams({
          scale: p.scale() * (Math.PI * 2),
          translate: p.translate()
        });
      }
    }
  };
  useEffect(() => {
    doAsyncAction();
  }, []);
  return (
    dashboard &&
    dashboardQueryVariables &&
    dashboardProjectionParams &&
    dashboardMap &&
    dashboardData && (
      <React.Fragment>
        {
          <Layout
            {...({
              dashboard,
              dashboardQueryVariables,
              dashboardQueryVariablesSetter: setDashboardQueryVariables,
              dashboardProjectionParamsSetter: setDashboardProjectionParams,
              dashboardMap,
              dashboardProjectionParams,
              width,
              height,
              dashboardData
            } as any)}
          />
        }
      </React.Fragment>
    )
  );
}

export default withSize({ monitorHeight: true })(DashboardView);
