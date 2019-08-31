import React from "react";
import { geoPath, geoMercator } from "d3-geo";

import {
  Dashboard,
  DashboardProjectionParams,
  DashboardMap,
  DashboardQueryVariables,
  DashboardData
} from "../../../specs/index";
export interface PoliticalProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardMap: DashboardMap;
  dashboardQueryVariables: DashboardQueryVariables;
  dashboardData: DashboardData;
}
import styles from "./atlas.scss";

import { scaleLinear } from "d3-scale";

export function getRealData(
  map: DashboardMap,
  data: DashboardData
): Array<Datum> {
  return map.geojson.features.map((geo: any) => {
    const row = (data.payload as Array<any>).find(
      (r: any) => r.neighbourhood === geo.properties.neighbourhood
    );

    return {
      value: row ? row.avg_price : null,
      id: geo.properties.neighbourhood
    };
  });
}

export interface Datum {
  value: any;
  id: string;
}

export default function Political(props: PoliticalProps) {
  const {
    dashboardMap,
    dashboardProjectionParams,
    //dashboardQueryVariables,
    dashboardData
  } = props;
  const data = getRealData(dashboardMap, dashboardData);

  const domain = [
    Math.min.apply(null, data.map((el: any) => el.value)),
    Math.max.apply(null, data.map((el: any) => el.value))
  ];
  let range = ["rgba(135,206,235,1)", "rgba(205,92,92,1)"] as any;
  var colorScale = scaleLinear()
    .range(range)
    .domain(domain);

  const { scale, translate } = dashboardProjectionParams;

  const projection = geoMercator()
    .scale(scale / (Math.PI * 2))
    .translate(translate);
  const p = geoPath(projection);
  return (
    <g className="counties">
      {dashboardMap.geojson.features.map((d: any, i: number) => {
        const dataObject = data[i];
        return (
          <path
            key={i}
            d={p(d) as any}
            className={styles.politicalPath}
            onClick={() => {}}
            //fill={colorScale(dataObject.value) as any}
            fill="transparent"
            stroke={colorScale(dataObject.value) as any}
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
}
