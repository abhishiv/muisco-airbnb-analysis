import React, { useState, useEffect } from "react";
import { geoPath, geoMercator } from "d3-geo";

import {
  Dashboard,
  DashboardProjectionParams,
  DashboardMap,
  DashboardQuery
} from "../../../specs/index";
export interface PoliticalProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardMap: DashboardMap;
  dashboardQuery: DashboardQuery;
}
import styles from "./atlas.scss";

import { scaleLinear } from "d3-scale";

export async function getRealData(map: DashboardMap) {
  const req = await fetch("_api/airbnb/diced");
  const json = await req.json();

  return map.geojson.features.map((geo: any) => {
    const row = json.rows.find(
      (r: any) => r.neighbourhood === geo.properties.neighbourhood
    );

    return { value: row ? row.count : null, id: geo.properties.neighbourhood };
  });
}

export interface Datum {
  value: any;
  id: string;
}

export function getDummyData(map: DashboardMap) {
  return map.geojson.features.map((el: any) => {
    console.log("el", el);
    return { value: Math.random() * 10000 };
  });
}

export default function Political(props: PoliticalProps) {
  const { dashboardMap, dashboardProjectionParams, dashboardQuery } = props;

  const [data, setDataset] = useState<Array<Datum>>();
  const doAsyncAction = async () => {
    const data = await getRealData(dashboardMap);
    setDataset(data);
  };
  useEffect(() => {
    doAsyncAction();
  }, []);

  useEffect(() => {
    doAsyncAction();
  }, [dashboardQuery.cityName]);

  if (!data) {
    return null;
  }
  console.log(data);

  const domain = [
    Math.min.apply(null, data.map((el: any) => el.value)),
    Math.max.apply(null, data.map((el: any) => el.value))
  ];
  const range = [
    "rgb(237, 248, 233)",
    "rgb(186, 228, 179)",
    "rgb(116,196,118)",
    "rgb(49,163,84)",
    "rgb(0,109,44)"
  ] as any;
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
            fill={colorScale(dataObject.value) as any}
            stroke="#000"
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
}
