import React from "react";
import { tile } from "d3-tile";
import { geoEquirectangular } from "d3-geo";
export interface TilesProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  tileSize: number;
}
export default function Tiles({
  k,
  tx,
  ty,
  width,
  height,
  tileSize
}: TilesProps) {
  const tiles = tile()
    .size([width, height])
    .scale(k)
    .tileSize(tileSize)
    .translate([tx, ty])(); //
  console.log("tiles", tiles);
  return (
    <div>
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
