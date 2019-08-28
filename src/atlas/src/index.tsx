import React from "react";
import Dimensions from "react-dimensions";

import Map from "./components/map/index";

export interface WorldMapProps {
  containerWidth: number;
  containerHeight: number;
}
export interface WorldMapState {}
class WorldMap extends React.Component<any, WorldMapState> {
  constructor(props: WorldMapProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Map
        width={this.props.containerWidth}
        height={this.props.containerHeight}
      />
    );
  }
}
export default Dimensions()(WorldMap);
