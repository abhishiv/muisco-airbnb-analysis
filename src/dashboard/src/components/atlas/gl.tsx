import React from "react";
// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { mapbox_access_token } from "./tiles";
const Map = ReactMapboxGl({
  accessToken: mapbox_access_token
});

// in render()
export interface GLProps {
  width: number;
  height: number;
}
export default function GL(props: GLProps) {
  const { width, height } = props;
  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: height,
        width: width
      }}
    >
      <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      </Layer>
    </Map>
  );
}
