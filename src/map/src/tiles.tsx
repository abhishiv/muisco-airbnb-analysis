import React, { useEffect, useState } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useGesture } from "react-with-gesture";
import { useDrag } from "react-use-gesture";
import { tile } from "d3-tile";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "./110m.json";
import w from "./world-countries.json";
import us from "./us.json";
us;
world;
import { geoMercator } from "d3-geo";
function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}

export function getProjectionParams(
  projection: any,
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
  projection: any,
  width: number,
  height: number,
  center: [number, number],
  angle: number,
  delta: [number, number]
): ProjectionParams {
  const tau = 2 * Math.PI;
  console.log(projection, width, height, center, angle);
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
  projection: any;
}

function Tiles(props: TilesProps) {
  const { width, height } = props;
  const [tilesParams, setParams] = useState(({
    delta: [0, 0]
  } as unknown) as TilesParams);
  const tau = Math.PI * 2;
  const { tiles, features, projection, k, tx, ty } = tilesParams;
  const bind = useDrag(({ down, xy, delta, last }) => {
    const { k, tx, ty } = tilesParams;
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
        projection,
        tx: tx + delta[0],
        ty: ty + delta[1]
      });
    } else {
      setParams({
        ...tilesParams,
        delta: delta,
        tiles,
        projection
      });
    }
  });

  useEffect(() => {
    const features: any = feature(
      (w as unknown) as any,
      w.objects.countries1 as any
    );
    const tau = 2 * Math.PI; //
    const projection = geoMercator()
      .scale(1 / tau)
      .translate([0, 0]);
    const { k, tx, ty } = compute(projection, width, height, [100, 30], 20, [
      0,
      0
    ]);
    console.log("k", k, tx, ty);
    projection.scale(k / tau).translate([tx, ty]);
    const delta = [0, 0];
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
      projection
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

interface SliderProps {
  children: React.ReactNode;
}
export function Slider({ children }: SliderProps) {
  const [bind, { delta, down }] = useGesture();
  const { x, bg, size } = useSpring({
    x: down ? delta[0] : 0,
    bg: `linear-gradient(120deg, ${
      delta[0] < 0 ? "#f093fb 0%, #f5576c" : "#96fbc4 0%, #f9f586"
    } 100%)`,
    size: down ? 1.1 : 1,
    immediate: name => down && name === "x"
  });
  const avSize = x.interpolate({
    output: ["scale(0.5)", "scale(1)"],
    extrapolate: "clamp"
  });
  return (
    <animated.div {...bind()} className="item" style={{ background: bg }}>
      <animated.div
        className="av"
        style={{
          transform: avSize,
          justifySelf: delta[0] < 0 ? "end" : "start"
        }}
      />
      <animated.div
        className="fg"
        style={{
          transform: interpolate(
            [x, size],
            (x, s) => `translate3d(${x}px,0,0) scale(${s})`
          )
        }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
}
