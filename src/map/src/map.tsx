import React, { Component } from "react";
import Dimensions from "react-dimensions";
import { animated, Spring } from "react-spring/renderprops.cjs";

import { geoAlbersUsa, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import us from "./us.json";
import counties from "./counties.json";
import states from "./states.json";
console.log("us", us);
console.log("counties", counties);
console.log("states", states);
export interface WorldMapState {
  countyFeatures: any;
  stateFeatures: any;
  mode: "state" | "county";
}

class WorldMap extends Component<any, WorldMapState> {
  constructor(props: any) {
    super(props);
    this.state = {
      countyFeatures: null,
      stateFeatures: null,
      mode: "county"
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
    const countyFeatures: any = feature(
      (us as unknown) as any,
      us.objects.counties as any
    );
    const stateFeatures: any = feature(
      (us as unknown) as any,
      us.objects.states as any
    );
    this.setState({
      countyFeatures: countyFeatures.features.map((el: any) => {
        const county = counties.find(county => county.fips === el.id);
        return {
          d: el,
          meta: { county }
        };
      }),
      stateFeatures: stateFeatures.features.map((el: any) => {
        return {
          d: el,
          meta: {}
        };
      })
    });
  }
  render() {
    const { containerHeight, containerWidth } = this.props;
    if (!this.state.countyFeatures) return null;
    const statesList = Object.keys(states).sort();
    const proj = this.projection();
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
          <g key="s" className="states">
            {this.state.stateFeatures.map(({ d, meta }: any, i: number) => {
              let alpha = 1;
              alpha = d.id * (1 / 80);
              return (
                <Spring
                  native={true}
                  key={i}
                  from={{ x: 0 }}
                  to={{ x: this.state.mode === "county" ? 0 : alpha }}
                >
                  {style => {
                    const m = geoPath(proj)(d);
                    return (
                      <animated.path
                        d={m as any}
                        className="country"
                        opacity={style.x}
                        fill={`rgba(38,50,56,${1})`}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                      />
                    );
                  }}
                </Spring>
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
