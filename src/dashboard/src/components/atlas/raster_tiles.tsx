import React, { useState, useEffect } from "react";
import { tile } from "d3-tile";
import {} from "d3-geo";
import { Dashboard, DashboardProjectionParams } from "../../../specs/index";

import styles from "./atlas.scss";
export interface TilesProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
}
export default function Tiles(props: TilesProps) {
  const { width, height, tileSize, dashboardProjectionParams } = props;
  const { scale, translate } = dashboardProjectionParams;
  console.log(dashboardProjectionParams);
  const [vectorTiles, setVectorTiles] = useState();
  const worker = async () => {
    const tiler = tile()
      .size([width, height])
      .tileSize(tileSize)
      .scale(scale)
      .translate(translate);
    const tiles = tiler();

    setVectorTiles(tiles);
  };
  let timer: any;
  const watcher = () => {
    if (timer) {
      cancelAnimationFrame(timer);
    }
    timer = requestAnimationFrame(() => {
      worker();
    });
  };
  useEffect(watcher, []);
  useEffect(watcher, [scale, ...translate]);
  console.log("tiles", vectorTiles);
  return (
    <div className={styles.rasterMap}>
      {vectorTiles &&
        vectorTiles.map((tile: any, i: number) => {
          const style = {
            position: "absolute",
            left:
              (tile[0] + vectorTiles.translate[0]) * vectorTiles.scale + "px",
            top: (tile[1] + vectorTiles.translate[1]) * vectorTiles.scale + "px"
          };

          return (
            <div
              style={{
                backgroundImage: `url(${tileURL.apply(null, tile)})`,
                backgroundSize: "cover",
                width: tileSize,
                height: tileSize,
                ...(style as any)
              }}
              key={i}
            ></div>
          );
        })}
    </div>
  );
}

//        const src =
//          "https://" +
//          "abc"[tile[1] % 3] +
//          ".tile.openstreetmap.org/" +
//          tile[2] +
//          "/" +
//          tile[0] +
//          "/" +
//          tile[1] +
//          ".png";//

export const tileURL = (x: number, y: number, z: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${
    devicePixelRatio > 1 ? "@2x" : ""
  }?access_token=pk.eyJ1IjoidG1jdyIsImEiOiJjamN0Z3ZiOXEwanZkMnh2dGFuemkzemE3In0.gibebYiJ5TEdXvwjpCY0jg`;
