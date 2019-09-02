import React, { useState, useRef } from "react";
import {
  DashboardQueryVariables,
  Dashboard,
  DashboardProjectionParams,
  DashboardProjectionParamsSetter,
  DashboardMap
} from "../../../specs/index";
import { RouteComponentProps } from "react-router-dom";

import { useDrag } from "react-use-gesture";

import { geoMercator } from "d3-geo";

import styles from "./atlas.scss";
import TilesComponent from "./tiles";
//import RasterTilesComponent from "./raster_tiles";
import PoliticalComponent from "./political";
import { withRouter } from "react-router-dom";
import {
  animated,
  useSpring,
  config,
  useTransition,
  useChain
} from "react-spring";

function floor(k: number) {
  return Math.pow(2, Math.floor(Math.log(k) / Math.LN2));
}

export function getProjectionParams(
  width: number,
  height: number,
  lat: number,
  long: number,
  angle: number
): ProjectionParams {
  const center = [lat, long];
  const tau = Math.PI * 2;
  const projection = geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);
  const bounds = [
    [center[0] - angle, center[1] - angle],
    [center[0], center[1]]
  ];
  const p0 = projection([bounds[0][0], bounds[1][1]]);
  const p1 = projection([bounds[1][0], bounds[0][1]]);
  let k: number = 1;
  let tx: number = 0;
  let ty: number = 0;
  if (p1 && p0) {
    k = floor(
      0.9 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)
    );
    tx = (width - k * (p1[0] + p0[0])) / 2;
    ty = (height - k * (p1[1] + p0[1])) / 2;
    return { k, tx, ty };
  } else {
    return { k: 1, tx: 0, ty: 0 };
  }
}

export function compute(
  width: number,
  height: number,
  center: [number, number],
  angle: number,
  delta: [number, number]
): ProjectionParams {
  const { k, tx, ty } = getProjectionParams(
    width,
    height,
    center[0],
    center[1],
    angle
  );
  return { k, tx, ty };
}

export interface TilesProps {
  width: number;
  height: number;
  dashboard: Dashboard;
  getNextEntity: Function;
}
export interface ProjectionParams {
  tx: number;
  ty: number;
  k: number;
}

export interface TilesParams {
  delta: [number, number];
}
export interface AtlasProps
  extends RouteComponentProps<AtlasContainerPropsParams> {
  width: number;
  height: number;
  dashboardQueryVariables: DashboardQueryVariables;
  dashboardMap: DashboardMap;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardProjectionParamsSetter: DashboardProjectionParamsSetter;
}

export function Atlas(props: AtlasProps) {
  const {
    width: width,
    height: height,
    dashboardMap,
    dashboardProjectionParams,
    dashboardProjectionParamsSetter
  } = props;

  const [tilesParams, setParams] = useState({
    delta: [0, 0]
  } as TilesParams);
  const { delta } = tilesParams;

  let timer: any;
  const [tx, ty] = dashboardProjectionParams.translate;
  const bind = useDrag(({ down, xy, delta, last, shiftKey }) => {
    if (!shiftKey) {
      //return;
    }
    if (timer) {
      cancelAnimationFrame(timer);
    }
    timer = requestAnimationFrame(() => {
      if (last) {
        setParams({ delta: [0, 0] });
        dashboardProjectionParamsSetter({
          ...dashboardProjectionParams,
          translate: [tx + delta[0], ty + delta[1]]
        });
      } else {
        setParams({ delta });
        dashboardProjectionParamsSetter({
          ...dashboardProjectionParams
        });
      }
    });
  });
  bind;
  //  const projection = geoMercator()
  //    .scale(dashboardProjectionParams.scale / (Math.PI * 2))
  //    .translate(dashboardProjectionParams.translate) as GeoProjection;
  // node idea why `projection as GeoProjection` doesn't work
  //let center = (projection as any).invert([width / 2, height / 2]) as any;
  //        var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
  //a = Math.pow(b, c);
  //c = Math.log(a)/Math.log(b)
  // s = (512) * 0.5 / Math.PI * Math.pow(2, zoom)
  // ((((512) * 0.5) / s) / Math.PI) = Math.pow(2, zoom)
  // ((((512) * 0.5) / s) / Math.PI) = Math.pow(2, zoom)
  //let zoom = Math.log(512 / projection.scale() / (Math.PI * 0.5)) / Math.log(2);
  //  const z = Math.log2(projection.scale() / 512);
  //  const z0 = Math.round(Math.max(z + 0, 0));
  //  zoom = Math.pow(2, z - z0) * 512;
  //console.log(center, zoom);
  //center = [45.4641, 9.1919].reverse();
  const springRef = useRef();
  const transitionRef = useRef();
  const { opacity } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { opacity: 0 },
    to: { opacity: 1 }
  });
  const location = props.location;
  const transitions = useTransition(location, location => location.pathname, {
    ref: transitionRef,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  useChain([transitionRef, springRef]);

  return (
    <div
      {...bind()}
      draggable={false}
      style={{
        position: "absolute",
        width: width,
        height: height,
        overflow: "hidden"
      }}
    >
      <svg
        className={styles.svgMap}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {(() => {
          //return <Atlas {...props} />;
          //return <Atlas {...props} />;
          return transitions.map(({ item, props: p, key }) => (
            <animated.g
              style={{
                ...p
              }}
              native={true}
              key={key}
            >
              {true && (
                <TilesComponent
                  {...props}
                  key="1"
                  tileSize={2048}
                  {...tilesParams}
                  dashboardProjectionParams={{
                    ...dashboardProjectionParams,
                    translate: [tx + delta[0], ty + delta[1]]
                  }}
                  {...{ width, height }}
                >
                  <animated.g
                    native={true}
                    style={{
                      opacity
                    }}
                  >
                    <PoliticalComponent
                      key="1"
                      {...props}
                      tileSize={256}
                      {...tilesParams}
                      dashboardProjectionParams={{
                        ...dashboardProjectionParams,
                        translate: [tx + delta[0], ty + delta[1]]
                      }}
                      dashboardData={null as any}
                      loading={false}
                      {...{ width, height }}
                    />
                  </animated.g>
                </TilesComponent>
              )}
            </animated.g>
          ));
        })()}
        {}
        {null} }
      </svg>
    </div>
  );
}
interface AtlasContainerPropsParams {
  cityName: string;
}
export interface AtlasContainerProps extends AtlasProps {}
export function AtlasContainer(props: AtlasContainerProps) {
  return <Atlas {...props} />;
}
export default withRouter(AtlasContainer as any);
