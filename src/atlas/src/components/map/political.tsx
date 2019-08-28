import React from "react";
import { geoPath, geoMercator } from "d3-geo";
export interface PoliticalProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  features: any;
}
import styles from "./map.scss";
export default function Political(props: PoliticalProps) {
  const { k, tx, ty, width, height, features } = props;
  const tau = 2 * Math.PI; //
  const projection = geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);
  projection.scale(k / tau).translate([tx, ty]);
  const p = geoPath(projection);
  return (
    <svg
      className={styles.svgMap}
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
              className={styles.politicalPath}
              onClick={() => {
                console.log("d", d);
              }}
              fill={`rgba(38,50,56,${0})`}
              stroke="#000"
              strokeWidth={0.5}
            />
          );
        })}
      </g>
    </svg>
  );
}
