import React, { Component } from "react";
import Dimensions from "react-dimensions";
import { geoAlbersUsa, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import us from "./10m.json";
export interface WorldMapState {
  worldData: any;
}
class WorldMap extends Component<any, WorldMapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      worldData: null
    };
  }
  projection() {
    const { containerHeight, containerWidth } = this.props;
    const b = geoMercator()
      .scale(1000)
      .translate([containerWidth / 2, containerHeight / 2]);
    b;
    const projection = geoAlbersUsa()
      .scale(100)
      .translate([containerWidth / 2, containerHeight / 2]);
    projection;
    return projection;
  }
  componentDidMount() {
    console.log("us", us);
    const features: any = feature(
      (us as unknown) as any,
      us.objects.counties as any
    );
    this.setState({
      worldData: features.features
    });
  }
  render() {
    const { containerHeight, containerWidth } = this.props;
    console.log("t", this.state);
    if (!this.state.worldData) return null;
    return (
      <svg
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      >
        <g className="countries">
          {this.state.worldData.map((d: any, i: number) => {
            const m = geoPath()(d);
            return (
              <path
                key={`path-${i}`}
                d={m as any}
                className="country"
                fill={`rgba(38,50,56,${(1 / this.state.worldData.length) * i})`}
                stroke="#FFFFFF"
                strokeWidth={0.5}
              />
            );
          })}
        </g>
      </svg>
    );
  }
}
export default Dimensions()(WorldMap);
// src/components/WorldMap.js

