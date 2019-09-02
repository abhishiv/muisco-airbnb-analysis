import React, { useState, useEffect } from "react";

import { withSize } from "react-sizeme";

import {
  Dashboard,
  DashboardMap,
  DashboardProjectionParams
} from "../specs/index";
import Layout from "./components/layout/index";
//import { GeoProjection } from "d3-geo";
import { geoMercator, geoPath } from "d3-geo";

export interface DashboardViewProps {
  size: { width: number; height: number };
  loading: boolean;
  dashboardMap: DashboardMap;
  dashboard: Dashboard;
}

export function DashboardView(props: DashboardViewProps) {
  const { dashboardMap, loading, dashboard } = props;
  const { width, height } = props.size || {};
  const [dashboardProjectionParams, setDashboardProjectionParams] = useState<
    DashboardProjectionParams
  >({
    scale: 1,
    translate: [0, 0]
  });
  const doAsyncAction = async () => {
    const projection = geoMercator()
      .scale(dashboardProjectionParams.scale / (Math.PI * 2))
      .translate(dashboardProjectionParams.translate);
    const path = geoPath(projection);
    let bounds = path.bounds(dashboardMap);
    const dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = 1 / Math.max(dx / width, dy / height),
      translate: [number, number] = [
        width / 2 - scale * x,
        height / 2 - scale * y
      ];

    const p = geoMercator()
      .scale(scale / (Math.PI * 2))
      .translate(translate)
      .fitSize([width - 300, height], dashboardMap);

    setDashboardProjectionParams({
      scale: p.scale() * (Math.PI * 2),
      translate: p.translate()
    });
  };
  useEffect(() => {
    doAsyncAction();
  }, []);
  return (
    !loading && (
      <React.Fragment>
        {
          <Layout
            {...({
              dashboard,
              dashboardProjectionParamsSetter: setDashboardProjectionParams,
              dashboardMap,
              dashboardProjectionParams,
              width,
              height
            } as any)}
          />
        }
      </React.Fragment>
    )
  );
}

export default withSize({ monitorHeight: true })(DashboardView);
