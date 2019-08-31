import React from "react";
import {
  DashboardQueryVariables,
  Dashboard,
  DashboardQueryVariablesSetter,
  DashboardData
} from "../../../specs/index";
import moment from "moment";
import { animated, useSprings } from "react-spring";
import styles from "./timeline.scss";
import { scaleLinear } from "d3-scale";

export function getRealData(
  map: DashboardMap,
  data: DashboardData
): Array<Datum> {
  return map.geojson.features.map((geo: any) => {
    const row = (data.payload as Array<any>).find(
      (r: any) => r.neighbourhood === geo.properties.neighbourhood
    );

    return {
      value: row ? row.avg_price : null,
      id: geo.properties.neighbourhood
    };
  });
}

export interface TimelineProps {
  dashboardQueryVariables: DashboardQueryVariables;
  dashboard: Dashboard;
  dashboardQueryVariablesSetter: DashboardQueryVariablesSetter;
  width: number;
  height: number;
  dashboardData: DashboardData;
}

export enum TimelineDisplayMode {
  DAY = 0,
  WEEK = 1,
  MONTH = 2,
  YEAR = 3
}

export function getTimelineDisplayMode(
  numberDays: number
):
  | TimelineDisplayMode.DAY
  | TimelineDisplayMode.WEEK
  | TimelineDisplayMode.MONTH
  | TimelineDisplayMode.YEAR {
  if (numberDays > 365 * 2) {
    return TimelineDisplayMode.YEAR;
  } else if (numberDays > 180) {
    return TimelineDisplayMode.MONTH;
  } else if (numberDays > 90) {
    return TimelineDisplayMode.WEEK;
  } else {
    return TimelineDisplayMode.DAY;
  }
}

export function Timeline(props: TimelineProps) {
  const format = "YYYY-MM-DD";
  const from = moment(props.dashboardQueryVariables.date[0]);
  const to = moment(props.dashboardQueryVariables.date[1]);
  const numberDays = to.diff(from, "day");
  //const mode = getTimelineDisplayMode(numberDays);
  const WIDTH = 5;
  const columnSize = Math.floor(props.width / (WIDTH * 2));
  //const rowSize = Math.ceil(numberDays / columnSize);
  const [springs] = useSprings(numberDays, i => {
    const row = Math.floor(i / columnSize) + 1;
    const column = Math.ceil(i % columnSize);
    return {
      opacity: 1,
      left: WIDTH * 2 * column + "px",
      top: WIDTH * 2 * row + "px"
    };
  });

  const days = new Array(numberDays)
    .fill(true)
    .map((el, i) => from.clone().add(i, "day"));
  return springs.map((props, i) => {
    const item = days[i];
    return (
      <animated.div
        className={styles.day}
        key={item.format(format)}
        style={props}
      ></animated.div>
    );
  });
}
function TimelineManager(props: TimelineProps) {
  const {
    dashboardMap,
    dashboardProjectionParams,
    //dashboardQueryVariables,
    dashboardData
  } = props;

  const data = getRealData(dashboardMap, dashboardData);

  const domain = [
    Math.min.apply(null, data.map((el: any) => el.value)),
    Math.max.apply(null, data.map((el: any) => el.value))
  ];
  let range = ["rgba(135,206,235,1)", "rgba(205,92,92,1)"] as any;
  var colorScale = scaleLinear()
    .range(range)
    .domain(domain);

  colorScale;
  const from = moment(props.dashboardQueryVariables.date[0]);
  const to = moment(props.dashboardQueryVariables.date[1]);
  const numberDays = to.diff(from, "day");
  const format = "YYYY-MM-DD";
  const updateRange = ([fromDelta, toDelta]:
    | [number, null]
    | [null, number]) => {
    if (fromDelta && Number.isFinite(fromDelta)) {
      props.dashboardQueryVariablesSetter({
        ...props.dashboardQueryVariables,
        date: [
          from
            .clone()
            .add(fromDelta, "day")
            .format(format),
          to.format(format)
        ]
      });
    } else if (toDelta && Number.isFinite(toDelta)) {
      props.dashboardQueryVariablesSetter({
        ...props.dashboardQueryVariables,
        date: [
          from.format(format),
          to
            .clone()
            .add(toDelta, "day")
            .format(format)
        ]
      });
    }
  };
  const T = Timeline as any;
  return (
    <div className={styles.container}>
      <div className={styles.controlsBar} style={{ display: "inline-block" }}>
        <button onClick={() => updateRange([-1, null])}>+</button>
        <button onClick={() => updateRange([1, null])}>-</button>
        {numberDays}
        <button onClick={() => updateRange([null, -1])}>-</button>
        <button onClick={() => updateRange([null, 1])}>+</button>
      </div>
      <div className={styles.timelineContainer}>
        <T {...props} />
      </div>
    </div>
  );
}

export default TimelineManager;
