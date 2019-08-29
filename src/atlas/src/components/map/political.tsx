import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import get from "lodash.get";
import { AtlasMap, Dashboard } from "../../../specs/index";
export interface PoliticalProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  map: AtlasMap;
  getNextEntity: Function;
  onChangeCenter: Function;
  dashboard: Dashboard;
}

import styles from "./map.scss";
export default function Political(props: PoliticalProps) {
  const { k, tx, ty, width, height, map, onChangeCenter, dashboard } = props;
  const tau = 2 * Math.PI; //
  const projection = geoMercator()
    .scale(k / tau)
    .translate([tx, ty]);
  const p = geoPath(projection);
  const last =
    dashboard.atlas.entities.indexOf(map) ===
    dashboard.atlas.entities.length - 1;
  return (
    <g className="counties">
      {map.features.features.map((d: any, i: number) => {
        return (
          <path
            key={i}
            d={p(d) as any}
            className={
              styles.politicalPath + " " + (last ? styles.lastPath : "")
            }
            onClick={() => {
              if (!last) return false;
              const projection = geoMercator()
                .scale(k / tau)
                .translate([tx, ty])
                .fitSize([width - 300, height], d);
              onChangeCenter(projection.scale() * tau, projection.translate());
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
  );
}
