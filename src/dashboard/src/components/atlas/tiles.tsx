import React, { useEffect, useState } from "react";
import { tile } from "d3-tile";
import { geoPath, geoMercator } from "d3-geo";
import Protobuf from "pbf";
import { Dashboard } from "../../../specs/index";
import styles from "./atlas.scss";

export interface TilesProps {
  k: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
}
const mapbox_access_token =
  "pk.eyJ1IjoiYWJvdXRhYXJvbiIsImEiOiJsRTRpMGJnIn0.aprlJ6wE1JQqBx4EH1lkMQ";
import vt from "@mapbox/vector-tile";

function filter(param: any, test: Function) {
  if (param) {
    const { features } = param;
    return {
      type: "FeatureCollection",
      features: features ? features.filter(test) : []
    };
  }
}
export async function getVectorTiles(tiles: any) {
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

export function resamplecoordinates(coordinates: any[]) {
  var i = 0,
    j = -1,
    n = coordinates.length,
    source = coordinates.slice(),
    p0,
    x0,
    y0,
    p1 = coordinates[0],
    x1 = p1[0],
    y1 = p1[1],
    dx,
    dy,
    d2,
    m2 = 10; // squared minimum angular distance
  while (++i < n) {
    (p0 = p1), (x0 = x1), (y0 = y1);
    (p1 = source[i]), (x1 = p1[0]), (y1 = p1[1]);
    (dx = x1 - x0), (dy = y1 - y0), (d2 = dx * dx + dy * dy);
    coordinates[++j] = p0;
    if (d2 > m2)
      for (var k = 1, m = Math.ceil(Math.sqrt(d2 / m2)); k < m; ++k) {
        coordinates[++j] = [x0 + (dx * k) / m, y0 + (dy * k) / m];
      }
  }
  coordinates[++j] = p1;
  coordinates.length = j + 1;
  return coordinates;
}
export function resample(obj: any) {
  obj = JSON.parse(JSON.stringify(obj)); // deep clone urk
  switch (obj.type) {
    case "FeatureCollection":
      obj.features = obj.features.map(resample);
      break;
    case "Feature":
      obj.geometry = resample(obj.geometry);
      break;
    case "MultiPolygon":
      obj.coordinates = obj.coordinates.map((d: any[]) =>
        d.map(resamplecoordinates)
      );
      break;
    case "Polygon":
      obj.coordinates = obj.coordinates.map(resamplecoordinates);
      break;
    case "MultiLineString":
      obj.coordinates = obj.coordinates.map(resamplecoordinates);
      break;
    case "LineString":
      obj.coordinates = resamplecoordinates(obj.coordinates);
      break;
  }
  return obj;
}
function geojson([x, y, z], layer) {
  if (!layer) return;
  const features = new Array(layer.length);
  for (let i = 0; i < layer.length; ++i)
    features[i] = layer.feature(i).toGeoJSON(x, y, z);
  var t = { type: "FeatureCollection", features };
  //t = resample(t);

  return t;
}
export default function Tiles(props: TilesProps) {
  const { k, tx, ty, width, height, tileSize, dashboard } = props;

  const [vectorTiles, setVectorTiles] = useState();
  const tau = 2 * Math.PI; //
  const projection = geoMercator()
    .scale(k / tau)
    .translate([tx, ty]);
  const path = geoPath(projection);
  const worker = async () => {
    const tiler = tile()
      .size([width, height])
      .tileSize(tileSize)
      .scale(k)
      .translate([tx, ty]);
    const tiles = tiler();
    const vtiles = await getVectorTiles(tiles);

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
  }, [k, tx, ty]);
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
          return (
            <g key={i}>
              {false && (
                <path
                  key="road"
                  d={path(filter(geojson(d, d.layers.road), d => isHighway(d)))}
                  stroke="brown"
                ></path>
              )}{" "}
              <path
                key="water"
                fill="skyblue"
                d={path(
                  filter(geojson(d, d.layers.water), d => !is_water_line(d))
                )}
                stroke="aliceblue"
              ></path>
              <path
                key="waterline"
                stroke="orange"
                strokeWidth={2}
                d={path(filter(geojson(d, d.layers.water), is_water_line))}
              ></path>
            </g>
          );
        })}
    </React.Fragment>
  );
}