import React from "react";
import { geoPath, geoEquirectangular } from "d3-geo";
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
  const { k, tx, ty, width, height, map, onChangeCenter } = props;
  const tau = 2 * Math.PI; //
  const projection = geoEquirectangular()
    .scale(k / tau)
    .translate([tx, ty]);
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
                const projection = geoEquirectangular()
                  .scale(k / tau)
                  .translate([tx, ty])
                  .fitSize([width, height], d);
                console.log("d", d, projection.scale(), projection.translate());
                onChangeCenter(projection.scale(), projection.translate());
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
