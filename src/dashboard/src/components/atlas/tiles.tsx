import React, { useEffect, useState } from "react";
import { tile } from "d3-tile";
import { geoPath, geoMercator } from "d3-geo";
import Protobuf from "pbf";
import { Dashboard, DashboardProjectionParams } from "../../../specs/index";

export interface TilesProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
}
const mapbox_access_token =
  "pk.eyJ1IjoiYWJvdXRhYXJvbiIsImEiOiJsRTRpMGJnIn0.aprlJ6wE1JQqBx4EH1lkMQ";
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
    console.log("v", vtiles, tiles);
    setVectorTiles(vtiles);
  };
  let timer: any;
  useEffect(() => {
    if (timer) {
      cancelAnimationFrame(timer);
    }
    timer = requestAnimationFrame(() => {
      worker();
    });
  }, []);
  useEffect(() => {
    worker();
  }, [scale, ...translate]);

  const projection = geoMercator()
    .scale(scale / (Math.PI * 2))
    .translate(translate);
  const path = geoPath(projection);

  return (
    <React.Fragment>
      {vectorTiles &&
        vectorTiles.map((d: any, i: number) => {
          const is_water_line = (d: any) =>
            ["canal", "drain", "river", "stream"].indexOf(d.properties.kind) >
            -1;
          const isHighway = (d: any) => {
            return d.properties.type === "primary";
          };
          const roadJSON = geojson(d, d.layers.road);
          const waterJSON = geojson(d, d.layers.water);
          return (
            <g key={i}>
              {roadJSON && (
                <path
                  key="road"
                  d={
                    path(filter(roadJSON, (d: any) => isHighway(d)) as any) ||
                    ""
                  }
                  stroke="brown"
                ></path>
              )}{" "}
              {waterJSON && (
                <path
                  key="water"
                  fill="skyblue"
                  d={
                    path(filter(
                      waterJSON,
                      (d: any) => !is_water_line(d)
                    ) as any) || ""
                  }
                  stroke="aliceblue"
                ></path>
              )}
              <path
                key="waterline"
                stroke="orange"
                strokeWidth={2}
                d={path(filter(waterJSON, is_water_line) as any) || ""}
              ></path>
            </g>
          );
        })}
    </React.Fragment>
  );
}
