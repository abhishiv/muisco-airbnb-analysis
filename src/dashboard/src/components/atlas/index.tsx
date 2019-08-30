import React, { useState, useEffect } from "react";
import {
  DashboardQuery,
  Dashboard,
  DashboardQuerySetter
} from "../../../specs/index";

import { useDrag } from "react-use-gesture";

import { geoMercator } from "d3-geo";

import styles from "./atlas.scss";

function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}
import TilesComponent from "./tiles";

export function getProjectionParams(
  width: number,
  height: number,
  lat: number,
  long: number,
  angle: number
): ProjectionParams {
  const center = [lat, long];
  const tau = Math.PI * 2;
  const projection = geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

  const bounds = [
    [center[0] - angle, center[1] - angle],
    [center[0], center[1]]
  ];
  const p0 = projection([bounds[0][0], bounds[1][1]]);
  const p1 = projection([bounds[1][0], bounds[0][1]]);
  let k: number = 1;
  let tx: number = 0;
  let ty: number = 0;
  if (p1 && p0) {
    k = floor(
      0.9 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)
    );
    tx = (width - k * (p1[0] + p0[0])) / 2;
    ty = (height - k * (p1[1] + p0[1])) / 2;
    return { k, tx, ty };
  } else {
    return { k: 1, tx: 0, ty: 0 };
  }
}

export function compute(
  width: number,
  height: number,
  center: [number, number],
  angle: number,
  delta: [number, number]
): ProjectionParams {
  const { k, tx, ty } = getProjectionParams(
    width,
    height,
    center[0],
    center[1],
    angle
  );
  return { k, tx, ty };
}

export interface TilesProps {
  width: number;
  height: number;
  dashboard: Dashboard;
  getNextEntity: Function;
}
export interface ProjectionParams {
  tx: number;
  ty: number;
  k: number;
}

export interface TilesParams extends ProjectionParams {
  delta: [number, number];
}
export interface AtlasProps {
  width: number;
  height: number;
  dashboardQuery: DashboardQuery;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
}

export default function Atlas(props: AtlasProps) {
  const { width: width, height: height, dashboard, dashboardQuery } = props;

  const [tilesParams, setParams] = useState({
    delta: [0, 0],
    k: 4096,
    tx: 0,
    ty: 0
  } as TilesParams);
  const { k, tx, ty, delta } = tilesParams;

  useEffect(() => {
    const tau = Math.PI * 2;
    const projection = geoMercator()
      .scale(k / tau)
      .translate([tx, ty]);
    const city = dashboard.cities.find(
      el => el.name === dashboardQuery.cityName
    );
    console.log(city, dashboardQuery, dashboard);
    if (city) {
      const [tx0, ty0] = projection(city.location);
      console.log("t", city.location, tx0, ty0);
      setParams({
        ...tilesParams,
        tx: tx0,
        ty: ty0,
        k: k
      });
    }
    //    const { entities }: { entities: any[] } = dashboard.atlas;
    //    if (entities.length > 0) {
    //      var { k, tx, ty } = compute(width, height, [110, 35], 35, [0, 0]);
    //      setParams({
    //        k: k,
    //        tx,
    //        ty,
    //        delta: [0, 0]
    //      });
    //    }
  }, []);
  let timer: any;
  const bind = useDrag(({ down, xy, delta, last }) => {
    if (timer) {
      cancelAnimationFrame(timer);
    }
    timer = requestAnimationFrame(() => {
      const { tx, ty } = tilesParams;
      if (last) {
        setParams({
          ...tilesParams,
          delta: [0, 0],
          tx: tx + delta[0],
          ty: ty + delta[1]
        });
      } else {
        setParams({
          ...tilesParams,
          delta: delta
        });
      }
    });
  });

  return (
    <div
      {...bind()}
      style={{
        position: "absolute",
        width: width,
        height: height,
        overflow: "hidden"
      }}
    >
      <svg
        className={styles.svgMap}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {Number.isFinite(width) && (
          <TilesComponent
            {...props}
            tileSize={256}
            {...tilesParams}
            {...{ width, height, tx: tx + delta[0], ty: ty + delta[1] }}
          />
        )}
      </svg>
    </div>
  );
}
