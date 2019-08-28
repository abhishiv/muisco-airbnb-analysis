import React from "react";
import { tile } from "d3-tile";
import world from "./110m.json";
import us from "./us.json";
us;
world;
export interface TilesProps {
  width: number;
  height: number;
}
function position(tile: any, tiles: any) {
  const [x, y] = tile;
  const {
    translate: [tx, ty],
    scale: k
  } = tiles;
  return [(x + tx) * k, (y + ty) * k];
}
export interface TilesState {
  tiles: any[];
}
import { geoMercator } from "d3-geo";
class Tiles extends React.Component<TilesProps, TilesState> {
  constructor(props: TilesProps) {
    super(props);
    this.state = { tiles: [] };
  }
  componentDidMount() {
    const { width, height } = this.props;
    const pi = Math.PI;
    const tau = 2 * pi;

    const projection = geoMercator()
      .scale(1 / tau)
      .translate([0, 0]);

    const bounds = [[70, 20], [90, 40]];
    const p0 = projection([bounds[0][0], bounds[1][1]]);
    const p1 = projection([bounds[1][0], bounds[0][1]]);

    function floor(k) {
      return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
    }

    const k = floor(
      0.95 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)
    );
    const tx = (width - k * (p1[0] + p0[0])) / 2;
    const ty = (height - k * (p1[1] + p0[1])) / 2;

    projection.scale(k / tau).translate([tx, ty]);

    const tiles = tile()
      .size([width, height])
      .scale(k)
      .tileSize(256)
      .translate([tx, ty])();

    console.log("tiles", tiles);
    this.setState({ tiles });
    for (const t of tiles) {
      console.log(`tile ${t} is at ${position(t, tiles)}`);
    }
  }
  renderTiles = (tiles: any) => {
    return (
      <React.Fragment>
        {tiles.map((tile: any, i: number) => {
          const p = position(tile, tiles);
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
                ...style
              }}
              key={i}
            ></div>
          );
        })}
      </React.Fragment>
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
      </div>
    );
  }
}

export default Tiles;
export const url = (x: number, y: number, z: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${
    devicePixelRatio > 1 ? "@2x" : ""
  }?access_token=pk.eyJ1IjoidG1jdyIsImEiOiJjamN0Z3ZiOXEwanZkMnh2dGFuemkzemE3In0.gibebYiJ5TEdXvwjpCY0jg`;
