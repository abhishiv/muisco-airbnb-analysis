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

export function getDummyData(map: DashboardMap) {
  return map.geojson.features.map((el: any) => {
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
  }, [dashboardQuery.cityName]);

  if (!data) {
    return null;
  }

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
