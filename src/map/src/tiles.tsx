import React from "react";
import { tile } from "d3-tile";
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "./110m.json";
import w from "./world-countries.json";
import us from "./us.json";
us;
world;
export interface TilesProps {
  width: number;
  height: number;
}
export interface TilesState {
  tiles: any[];
  projection: any;
  features: any;
  location: any;
}
import { geoMercator } from "d3-geo";
function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}
class Tiles extends React.Component<TilesProps, TilesState> {
  constructor(props: TilesProps) {
    super(props);
    this.state = {
      tiles: [],
      projection: null,
      features: null,
      location: null
    };
  }
  componentDidMount() {
    const { width, height } = this.props;
    const pi = Math.PI;
    const tau = 2 * pi;

    const projection = geoMercator()
      .scale(1 / tau)
      .translate([0, 0]);

    const center = [80, 25];
    const delta = 1;
    const bounds = [
      [center[0] - delta, center[1] - delta],
      [center[0], center[1]]
    ];
    const p0 = projection([bounds[0][0], bounds[1][1]]);
    const p1 = projection([bounds[1][0], bounds[0][1]]);
    let k: number = 1;
    let tx: number = 0;
    let ty: number = 0;
    if (p1 && p0) {
      k = floor(
        0.95 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)
      );
      tx = (width - k * (p1[0] + p0[0])) / 2;
      ty = (height - k * (p1[1] + p0[1])) / 2;
      console.log("k", k, tau, k / tau);
      projection.scale(k / tau).translate([tx, ty]);
    }

    const tiles = tile()
      .size([width, height])
      .scale(k)
      .tileSize(256)
      .translate([tx, ty])();
    const features: any = feature(
      (w as unknown) as any,
      w.objects.countries1 as any
    );

    console.log("tiles", tiles);
    this.setState({ tiles, projection, features });
  }
  renderTiles = (tiles: any) => {
    return (
      <div>
        {tiles.map((tile: any, i: number) => {
          //console.log("tile", tile, p);
          const style = {
            position: "absolute",
            left: (tile[0] + tiles.translate[0]) * tiles.scale + "px",
            top: (tile[1] + tiles.translate[1]) * tiles.scale + "px"
          };
          const src =
            "http://" +
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
                width: 256,
                height: 256,
                ...(style as any)
              }}
              key={i}
            ></div>
          );
        })}
      </div>
    );
  };
  renderSVG = () => {
    const { width, height } = this.props;
    const p = geoPath(this.state.projection);
    console.log("world", w, this.state);
    return (
      <svg
        style={{ position: "absolute" }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g className="counties">
          {this.state.features.features.map((d: any, i: number) => {
            return (
              <path
                key={i}
                d={p(d) as any}
                className="country"
                onClick={() => {}}
                fill={`rgba(38,50,56,${0})`}
                stroke="#000"
                strokeWidth={0.5}
              />
            );
          })}
        </g>
      </svg>
    );
  };
  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: this.props.width,
          height: this.props.height,
          overflow: "hidden"
        }}
      >
        {this.state.tiles && this.renderTiles(this.state.tiles)}
        {this.state.features && this.renderSVG()}
      </div>
    );
  }
}

export default Tiles;
export const url = (x: number, y: number, z: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${
    devicePixelRatio > 1 ? "@2x" : ""
  }?access_token=pk.eyJ1IjoidG1jdyIsImEiOiJjamN0Z3ZiOXEwanZkMnh2dGFuemkzemE3In0.gibebYiJ5TEdXvwjpCY0jg`;
