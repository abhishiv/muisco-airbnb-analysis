import React, { useState } from "react";
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
    const row = (data.payload.grouped.rows as Array<any>).find(
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
  const [opacityRecordId, setOpacityRecordId] = useState<string | null>();
  let range = [`rgba(143, 188, 143,${1})`, `rgba(205,92,92,${1})`] as any;
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

        const st = {
          opacity: opacityRecordId === d.properties.neighbourhood ? 1 : 0.5
        };
        return (
          <path
            key={i}
            d={p(d) as any}
            style={st}
            className={styles.politicalPath}
            onMouseEnter={() => {
              setOpacityRecordId(d.properties.neighbourhood);
            }}
            onMouseLeave={() => setOpacityRecordId(null)}
            onClick={() => {}}
            fill={colorScale(dataObject.value) as any}
            //fill="transparent"
            stroke={"black"}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}
