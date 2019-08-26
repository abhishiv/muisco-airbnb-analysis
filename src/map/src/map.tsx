import React, { Component } from "react";
import Dimensions from "react-dimensions";
import { geoAlbersUsa, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import us from "./us.json";
import counties from "./counties.json";
console.log("us", us);
console.log("counties", counties);
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
      .scale(1000)
      .translate([containerWidth / 2, containerHeight / 2]);
    projection;
    return projection;
  }
  componentDidMount() {
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
    if (!this.state.worldData) return null;
    return (
      <svg
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      >
        <g className="countries">
          {this.state.worldData.map((d: any, i: number) => {
            const county = counties.find(el => el.fips === d.id);
            county;
            const m = geoPath(this.projection())(d);
            return (
              <path
                key={`path-${i}`}
                d={m as any}
                className="country"
                fill={`rgba(38,50,56,1`}
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
