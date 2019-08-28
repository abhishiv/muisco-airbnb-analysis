import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import get from "lodash.get";
import { AtlasMap } from "../../../specs/index";
export interface PoliticalProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  map: AtlasMap;
  getNextEntity: Function;
}
import styles from "./map.scss";
export default function Political(props: PoliticalProps) {
  const { k, tx, ty, width, height, map } = props;
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
        {map.features.features.map((d: any, i: number) => {
          return (
            <path
              key={i}
              d={p(d) as any}
              className={styles.politicalPath}
              onClick={() => {
                console.log("d", d);
                const id = get(d, props.map.topojsonIdProp);
                props.getNextEntity(id);
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
