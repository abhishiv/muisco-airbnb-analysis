import React, { Component } from "react";
import Dimensions from "react-dimensions";
//import { animated, Spring } from "react-spring/renderprops.cjs";
import {} from "d3-path";
import { geoBounds, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
export interface WorldMapState {
  countyFeatures: any;
  stateFeatures: any;
  mode: "state" | "county";
}

import Tiles from "./tiles";

class WorldMap extends Component<any, WorldMapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      countyFeatures: null,
      stateFeatures: null,
      mode: "county"
    };
  }

  async componentDidMount() {
    const req = await fetch(
      "https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/world-countries-sans-antarctica.json"
    );

    const json = await req.json();
    console.log("json", json);
    const countyFeatures: any = feature(
      (json as unknown) as any,
      json.objects.countries1 as any
    );

    const { containerHeight, containerWidth } = this.props;
    const proj = geoMercator().translate([
      containerWidth / 2,
      containerHeight / 2
    ]);
    this.setState({
      countyFeatures: countyFeatures.features.map((el: any) => {
        return {
          d: el,
          meta: {},
          p: geoPath(proj)(el)
        };
      })
    });
  }
  render() {
    const { containerHeight, containerWidth } = this.props;
    if (!this.state.countyFeatures) return null;
    //const statesList = Object.keys(states).sort();
    return <Tiles width={containerWidth} height={containerHeight} />;
    return (
      <React.Fragment>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            this.setState({
              mode: this.state.mode === "county" ? "state" : "county"
            });
          }}
        >
          {" "}
          toggle{" "}
        </a>
        <svg
          width={containerWidth}
          height={containerHeight}
          viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        >
          <g className="counties">
            {this.state.countyFeatures.map(({ d, meta, p }: any, i: number) => {
              let alpha = 1;
              return (
                <path
                  key={i}
                  d={p}
                  className="country"
                  onClick={() => {
                    const bounds = geoBounds(d);
                    console.log("bounds", bounds, d);
                  }}
                  fill={`rgba(38,50,56,${
                    this.state.mode === "county" ? alpha : 1
                  })`}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                />
              );
            })}
          </g>
        </svg>
      </React.Fragment>
    );
  }
}
export default Dimensions()(WorldMap);
// src/components/WorldMap.js
