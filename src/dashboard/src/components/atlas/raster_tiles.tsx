import React from "react";
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
  const tiler = tile()
    .size([width, height])
    .tileSize(tileSize)
    .scale(scale)
    .translate(translate);
  const tiles = tiler();
  console.log("tiles", tiles);
  return (
    <div className={styles.rasterMap}>
      {tiles.map((tile: any, i: number) => {
        const style = {
          position: "absolute",
          left: (tile[0] + tiles.translate[0]) * tiles.scale + "px",
          top: (tile[1] + tiles.translate[1]) * tiles.scale + "px"
        };
        const src =
          "https://" +
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
