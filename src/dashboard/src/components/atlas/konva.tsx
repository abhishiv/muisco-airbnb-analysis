import React, { useEffect, useState } from "react";
import { tile } from "d3-tile";
import { geoPath, geoMercator } from "d3-geo";
import Protobuf from "pbf";
import { Dashboard, DashboardProjectionParams } from "../../../specs/index";

import { Stage, Path, Layer } from "react-konva";
export interface TilesProps {
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

  return (
    <React.Fragment>
      <Stage width={width} height={height}>
        <Layer width={width} height={height}>
          {vectorTiles &&
            vectorTiles.map((d: any, i: number) => {
              const roadJSON = geojson(d, d.layers.road);
              const isHighway = (d: any) => {
                return d.properties.type === "primary";
              };
              return (
                <React.Fragment key={i}>
                  {roadJSON && (
                    <Path
                      key={i}
                      fill="green"
                      data={
                        path(filter(roadJSON, (d: any) =>
                          isHighway(d)
                        ) as any) || ""
                      }
                      stroke="green"
                    ></Path>
                  )}
                </React.Fragment>
              );
            })}
        </Layer>
      </Stage>
    </React.Fragment>
  );
}
