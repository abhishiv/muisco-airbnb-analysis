import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";
import { tile } from "d3-tile";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import w from "./world-countries.json";
import { geoMercator, GeoProjection } from "d3-geo";
function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}

export function getProjectionParams(
  projection: GeoProjection,
  width: number,
  height: number,
  lat: number,
  long: number,
  angle: number
): ProjectionParams {
  const center = [lat, long];

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
  const tau = Math.PI * 2;
  const projection = geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);
  const { k, tx, ty } = getProjectionParams(
    projection,
    width,
    height,
    center[0],
    center[1],
    angle
  );
  console.log("k", k, tx, ty);

  return { k, tx, ty };
}

export interface TilesProps {
  width: number;
  height: number;
}
export interface ProjectionParams {
  tx: number;
  ty: number;
  k: number;
}
export interface TilesParams extends ProjectionParams {
  tiles: any[];
  features: any;
  delta: [number, number];
}
function Tiles(props: TilesProps) {
  const { width, height } = props;
  const [tilesParams, setParams] = useState(({
    delta: [0, 0]
  } as unknown) as TilesParams);
  const { tiles, features, k, tx, ty, delta } = tilesParams;
  const tau = 2 * Math.PI; //
  const projection = geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);
  console.log("k", k, tx, ty);
  projection.scale(k / tau).translate([tx + delta[0], ty + delta[1]]);
  const bind = useDrag(({ down, xy, delta, last }) => {
    const { k, tx, ty } = tilesParams;
    const tau = 2 * Math.PI; //
    const projection = geoMercator()
      .scale(1 / tau)
      .translate([0, 0]);

    projection.scale(k / tau).translate([tx, ty]);
    const tiles = tile()
      .size([width, height])
      .scale(k)
      .tileSize(256)
      .translate([tx + delta[0], ty + delta[1]])(); //
    if (last) {
      setParams({
        ...tilesParams,
        delta: [0, 0],
        tiles,
        tx: tx + delta[0],
        ty: ty + delta[1]
      });
    } else {
      setParams({
        ...tilesParams,
        delta: delta,
        tiles
      });
    }
  });

  useEffect(() => {
    const features: any = feature(
      (w as unknown) as any,
      w.objects.countries1 as any
    );
    const { k, tx, ty } = compute(width, height, [100, 30], 20, [0, 0]);
    const tau = 2 * Math.PI; //
    const projection = geoMercator()
      .scale(1 / tau)
      .translate([0, 0]);
    console.log("k", k, tx, ty);
    projection.scale(k / tau).translate([tx, ty]);
    const delta: [number, number] = [0, 0];
    const tiles = tile()
      .size([width, height])
      .scale(k)
      .tileSize(256)
      .translate([tx + delta[0], ty + delta[1]])(); //

    setParams({
      k,
      tx,
      ty,
      features,
      tiles,
      delta
    });
  }, []);

  const renderTiles = (tiles: any) => {
    return (
      <div>
        {tiles.map((tile: any, i: number) => {
          const style = {
            position: "absolute",
            left: (tile[0] + tiles.translate[0]) * tiles.scale + "px",
            top: (tile[1] + tiles.translate[1]) * tiles.scale + "px"
          };
          const src =
            "http://" +
            "abc"[tile[1] % 3] +
            ".tile.openstreetmap.org/" +
            tile[2] +
            "/" +
            tile[0] +
            "/" +
            tile[1] +
            ".png";

          return (
            <div
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                width: 256,
                height: 256,
                ...(style as any)
              }}
              key={i}
            ></div>
          );
        })}
      </div>
    );
  };
  const renderSVG = () => {
    const p = geoPath(projection);
    return (
      <svg
        style={{ position: "absolute" }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g className="counties">
          {features.features.map((d: any, i: number) => {
            return (
              <path
                key={i}
                d={p(d) as any}
                className="country"
                onClick={() => {}}
                fill={`rgba(38,50,56,${0})`}
                stroke="#000"
                strokeWidth={0.5}
              />
            );
          })}
        </g>
      </svg>
    );
  };
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
      {tiles && renderTiles(tiles)}
      {features && renderSVG()}
    </div>
  );
}

export default Tiles;
