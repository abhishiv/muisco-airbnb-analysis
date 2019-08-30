import React from "react";
import { geoPath, geoMercator } from "d3-geo";

import {
  Dashboard,
  DashboardProjectionParams,
  DashboardMap
} from "../../../specs/index";
export interface PoliticalProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardMap: DashboardMap;
}
import styles from "./atlas.scss";
export default function Political(props: PoliticalProps) {
  const { dashboardMap, dashboardProjectionParams } = props;

  const { scale, translate } = dashboardProjectionParams;
  const projection = geoMercator()
    .scale(scale / (Math.PI * 2))
    .translate(translate);
  const p = geoPath(projection);
  console.log(dashboardMap);
  return (
    <g className="counties">
      {dashboardMap.geojson.features.map((d: any, i: number) => {
        return (
          <path
            key={i}
            d={p(d) as any}
            className={styles.politicalPath}
            onClick={() => {}}
            fill={`rgba(38,50,56,${0})`}
            stroke="#000"
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
}
