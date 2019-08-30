import React, { useState } from "react";
import {
  DashboardQuery,
  Dashboard,
  DashboardQuerySetter,
  DashboardProjectionParams,
  DashboardProjectionParamsSetter,
  DashboardMap
} from "../../../specs/index";

import { useDrag } from "react-use-gesture";

import { geoMercator } from "d3-geo";

import styles from "./atlas.scss";
import TilesComponent from "./tiles";
import PoliticalComponent from "./political";

function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}

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

export interface TilesParams {
  delta: [number, number];
}
export interface AtlasProps {
  width: number;
  height: number;
  dashboardQuery: DashboardQuery;
  dashboardMap: DashboardMap;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardProjectionParamsSetter: DashboardProjectionParamsSetter;
}

export default function Atlas(props: AtlasProps) {
  const {
    width: width,
    height: height,

    dashboardProjectionParams,
    dashboardProjectionParamsSetter
  } = props;

  const [tilesParams, setParams] = useState({
    delta: [0, 0]
  } as TilesParams);
  const { delta } = tilesParams;

  let timer: any;
  const [tx, ty] = dashboardProjectionParams.translate;
  const bind = useDrag(({ down, xy, delta, last }) => {
    if (timer) {
      cancelAnimationFrame(timer);
    }
    timer = requestAnimationFrame(() => {
      if (last) {
        setParams({ delta: [0, 0] });
        dashboardProjectionParamsSetter({
          ...dashboardProjectionParams,
          translate: [tx + delta[0], ty + delta[1]]
        });
      } else {
        setParams({ delta });
        dashboardProjectionParamsSetter({
          ...dashboardProjectionParams
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
            dashboardProjectionParams={{
              ...dashboardProjectionParams,
              translate: [tx + delta[0], ty + delta[1]]
            }}
            {...{ width, height }}
          />
        )}
        {Number.isFinite(width) && (
          <PoliticalComponent
            {...props}
            tileSize={256}
            {...tilesParams}
            dashboardProjectionParams={{
              ...dashboardProjectionParams,
              translate: [tx + delta[0], ty + delta[1]]
            }}
            {...{ width, height }}
          />
        )}
      </svg>
    </div>
  );
}
