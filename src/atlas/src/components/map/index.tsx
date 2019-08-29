import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";

import { geoMercator } from "d3-geo";
import { Dashboard, AtlasMap } from "../../../specs/index";

import Political from "./political";
import Tiles from "./tiles";
import styles from "./map.scss";

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
export interface TilesParams extends ProjectionParams {
  delta: [number, number];
}
function Atlas(props: TilesProps) {
  const { width, height, dashboard } = props;
  console.log("dashbard", dashboard);
  const [tilesParams, setParams] = useState({
    delta: [0, 0]
  } as TilesParams);
  const { k, tx, ty, delta } = tilesParams;

  useEffect(() => {
    const { entities }: { entities: AtlasMap[] } = dashboard.atlas;
    if (entities.length > 0) {
      var { k, tx, ty } = compute(width, height, [110, 35], 35, [0, 0]);
      setParams({
        k: k,
        tx,
        ty,
        delta: [0, 0]
      });
    }
  }, []);

  const bind = useDrag(({ down, xy, delta, last }) => {
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
        {Number.isFinite(k) && dashboard.atlas.entityPath.length > 0 && (
          <Tiles
            tileSize={256}
            {...{
              k,
              tx: tx + delta[0],
              ty: ty + delta[1],
              width,
              height
            }}
          />
        )}
        {dashboard.atlas.entities.map((map, i) => {
          return (
            <Political
              key={i}
              getNextEntity={props.getNextEntity}
              onChangeCenter={(scale: number, translate: [number, number]) => {
                console.log(" onChangeCenter", scale, translate);
                const { k, tx, ty } = tilesParams;
                console.log(" k", k, [tx, ty]);

                setParams({
                  ...tilesParams,
                  k: scale,
                  tx: translate[0],
                  ty: translate[1]
                });
              }}
              map={map}
              {...{
                k,
                tx: tx + delta[0],
                ty: ty + delta[1],
                width,
                height
              }}
            />
          );
        })}
      </svg>
      <button
        onClick={() => {
          setParams({
            ...tilesParams,
            k: k * 2
          });
        }}
        style={{
          position: "absolute",
          left: 10,
          top: 10
        }}
      >
        +
      </button>
    </div>
  );
}

export default Atlas;
