import React, { useState, useEffect, useRef } from "react";
// ES6
import MapboxGL, { Map } from "mapbox-gl";
import { mapbox_access_token } from "./tiles";

MapboxGL.accessToken = mapbox_access_token;
// in render()
export interface GLProps {
  width: number;
  height: number;
  center: [number, number];
  zoom?: number;
}
export default function GL(props: GLProps) {
  const { width, height } = props;
  const [map, setMapbox] = useState<any>(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const m = new MapboxGL.Map({
      container: containerRef.current as any,
      style: "mapbox://styles/mapbox/dark-v9",
      center: props.center,
      zoom: 10
    });
    setMapbox(m);
    m.on("styledata", function() {
      m.removeLayer("place_label");
    });
  }, []);
  useEffect(() => {
    if (map) {
      console.log("setting map");
      map.setCenter(props.center);
    }
  }, [...props.center, props.zoom]);
  return (
    <div
      ref={containerRef}
      style={{
        height: height,
        width: width
      }}
    ></div>
  );
}
