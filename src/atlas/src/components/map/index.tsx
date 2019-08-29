import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";

import { geoEquirectangular } from "d3-geo";
import { Dashboard, AtlasMap } from "../../../specs/index";

import Political from "./political";
import Tiles from "./tiles";

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
  const projection = geoEquirectangular()
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
      0.95 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)
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
  const [tilesParams, setParams] = useState({
    delta: [0, 0]
  } as TilesParams);
  const { k, tx, ty, delta } = tilesParams;

  useEffect(() => {
    const { map }: { map: AtlasMap | null } = dashboard.atlas;
    if (map) {
      const { k, tx, ty } = compute(width, height, [110, 35], 35, [0, 0]);
      setParams({
        k,
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
      {dashboard.atlas.map && (
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
      {dashboard.atlas.map && (
        <Political
          getNextEntity={props.getNextEntity}
          onChangeCenter={(scale, translate) => {
            console.log(" onChangeCenter", scale, translate);
            setParams({
              ...tilesParams,
              k: scale * Math.PI * 2,
              tx: translate[0],
              ty: translate[1]
            });
          }}
          map={dashboard.atlas.map}
          {...{
            k,
            tx: tx + delta[0],
            ty: ty + delta[1],
            width,
            height
          }}
        />
      )}
    </div>
  );
}

export default Atlas;
