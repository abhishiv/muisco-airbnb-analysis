import React, { useEffect, useState } from "react";
import { tile } from "d3-tile";
import { geoPath, geoMercator } from "d3-geo";
import Protobuf from "pbf";
import { Dashboard, DashboardProjectionParams } from "../../../specs/index";
import styles from "./atlas.scss";
export interface TilesProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  children: React.ReactNode;
}
export const mapbox_access_token =
  "pk.eyJ1IjoiYWJoaXNoaXYiLCJhIjoiY2swMjQ3djlwMXZhbjNibzFnNXI4bzU0NCJ9.LDAmYQM6tdpdsBK30cnoqw";
import vt from "@mapbox/vector-tile";

function filter(param: any, test: Function) {
  if (param) {
    const { features }: { features: any } = param;
    return {
      type: "FeatureCollection",
      features: features ? features.filter(test) : []
    };
  }
}
export async function getVectorTiles(tiles: any[]) {
  return await Promise.all(
    tiles.map(async t => {
      const req = await fetch(
        `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/${t[2]}/${t[0]}/${t[1]}.mvt?access_token=${mapbox_access_token}`
      );
      const buf = await req.arrayBuffer();
      let data = new vt.VectorTile(new Protobuf(buf)).layers;

      t.layers = data;

      return t;
    })
  );
}

function geojson([x, y, z]: any, layer: any) {
  if (!layer) return;
  const features = new Array(layer.length);
  for (let i = 0; i < layer.length; ++i)
    features[i] = (layer as any).feature(i).toGeoJSON(x, y, z);
  var t = { type: "FeatureCollection", features };
  //t = resample(t);

  return t;
}
export default function Tiles(props: TilesProps) {
  const { width, height, tileSize, dashboardProjectionParams } = props;
  const { scale, translate } = dashboardProjectionParams;
  const [vectorTiles, setVectorTiles] = useState();
  const worker = async () => {
    const tiler = tile()
      .size([width, height])
      .tileSize(tileSize)
      .scale(scale)
      .translate(translate);
    const tiles = tiler();
    const vtiles = await getVectorTiles(tiles);
    setVectorTiles(vtiles);
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

  const projection = geoMercator()
    .scale(scale / (Math.PI * 2))
    .translate(translate);
  const path = geoPath(projection);
  const lowerLayers =
    vectorTiles &&
    vectorTiles.reduce((state: any, d: any, i: number) => {
      console.log(d);
      const waterJSON = geojson(d, d.layers.water);
      const is_water_line = (d: any) =>
        ["canal", "drain", "river", "stream"].indexOf(d.properties.kind) > -1;
      return [
        ...state,
        true && (
          <path
            fill="rgba(143, 188, 143, 0.2)"
            key={"landuse" + i}
            stroke="rgba(143, 188, 143, 0)"
            strokeWidth="2"
            d={
              path(filter(
                geojson(d, d.layers.landuse) as any,
                (dd: any) =>
                  ["park", "grass", "agriculture"].indexOf(
                    dd.properties.class
                  ) > -1
              ) as any) || ""
            }
          ></path>
        ),
        true && true && (
          <path
            key={"water" + i}
            fill="rgba(135, 206, 235,0.3)"
            d={
              path(filter(waterJSON, (d: any) => !is_water_line(d)) as any) ||
              ""
            }
            stroke="aliceblue"
          ></path>
        )
      ];
    }, []);
  const upperLayers =
    vectorTiles &&
    vectorTiles.reduce((state: any, d: any, i: number) => {
      const isHighway = (d: any) => {
        return d.properties.type === "primary";
      };
      const roadJSON = geojson(d, d.layers.road);
      return [
        ...state,
        roadJSON && (
          <path
            key={"road" + i}
            d={path(filter(roadJSON, (d: any) => isHighway(d)) as any) || ""}
            stroke="brown"
          ></path>
        )
      ];
    }, []);
  const labels =
    vectorTiles &&
    vectorTiles.reduce((state: any, d: any, vi: number) => {
      return [
        ...state,
        ...(d.layers.place_label
          ? (() => {
              const [x, y, z] = d;
              const layer = d.layers.place_label;
              const features = [];
              const dom = [];
              for (let i = 0; i < layer.length; ++i) {
                const f = layer.feature(i).toGeoJSON(x, y, z);
                const c = path.centroid(f.geometry);
                const fontSize = 25 - f.properties.symbolrank;

                const ranked = () => {
                  return true;
                };
                const rank = ranked();
                rank &&
                  fontSize > 5 &&
                  dom.push(
                    <g key={i + " " + vi}>
                      <text
                        className={styles.label}
                        textRendering="geometricPrecision"
                        textAnchor={f.properties.text_anchor}
                        fontSize={fontSize}
                        x={c[0]}
                        y={c[1]}
                      >
                        {f.properties.name_en}
                      </text>
                    </g>
                  );
                rank && features.push(f);
              }
              //console.log("k", k / tau);
              return dom;
            })()
          : [])
      ];
    }, []);
  return (
    <React.Fragment>
      {vectorTiles && lowerLayers}
      {props.children}
      {vectorTiles && upperLayers}
      {vectorTiles && labels}
    </React.Fragment>
  );
}
