export default {};
//import React from "react";
//import {
//  DashboardQueryVariables,
//  Dashboard,
//  DashboardQueryVariablesSetter,
//  DashboardData,
//  DashboardMap
//} from "../../../specs/index";
//import moment from "moment";
//import { animated, useSprings } from "react-spring";
//import styles from "./timeline.scss";
//import { scaleLinear } from "d3-scale";//

//import Heatmap from "./heatmap";
//Heatmap;
//export interface Datum {
//  count: number;
//  date: string;
//}
//export function getRealData(data: DashboardData): Array<Datum> {
//  return data.payload.byDate.rows;
//}//

//export enum TimelineDisplayMode {
//  DAY = 0,
//  WEEK = 1,
//  MONTH = 2,
//  QUARTER = 3,
//  YEAR = 4
//}//

//export function getTimelineDisplayMode(
//  numberDays: number
//):
//  | TimelineDisplayMode.DAY
//  | TimelineDisplayMode.WEEK
//  | TimelineDisplayMode.MONTH
//  | TimelineDisplayMode.YEAR {
//  if (numberDays > 365) {
//    return TimelineDisplayMode.YEAR;
//  } else if (numberDays > 180) {
//    return TimelineDisplayMode.MONTH;
//  } else if (numberDays > 90) {
//    return TimelineDisplayMode.WEEK;
//  } else {
//    return TimelineDisplayMode.DAY;
//  }
//}//

//export interface TimelineProps {
//  dashboardQueryVariables: DashboardQueryVariables;
//  dashboard: Dashboard;
//  dashboardQueryVariablesSetter: DashboardQueryVariablesSetter;
//  width: number;
//  height: number;
//  dashboardData: DashboardData;
//  dashboardMap: DashboardMap;
//}//

//export function Timeline(props: TimelineProps) {
//  const { dashboardData } = props;//

//  const data = getRealData(dashboardData);//

//  const domain = [
//    Math.min.apply(null, data.map((el: any) => el.count)),
//    Math.max.apply(null, data.map((el: any) => el.count))
//  ];
//  let range = ["#fce14c", "#ed3a3c"] as any;
//  range = ["#ed3a3c", "#fce14c", "#789b2a"] as any;
//  var colorScale = scaleLinear()
//    .range(range)
//    .domain(domain);//

//  colorScale;
//  const format = "YYYY-MM-DD";
//  const from = moment(props.dashboardQueryVariables.date[0])
//    .utc()
//    .startOf("day");
//  const to = moment(props.dashboardQueryVariables.date[1])
//    .utc()
//    .startOf("day");
//  const numberDays = to.clone().diff(from.clone(), "day");
//  console.log(numberDays);
//  //const mode = getTimelineDisplayMode(numberDays);
//  const WIDTH = 10;
//  const MARGIN = 5;
//  const columnSize = Math.floor((props.width - 0) / (WIDTH + MARGIN * 2));
//  //const rowSize = Math.ceil(numberDays / columnSize);
//  const days = new Array(numberDays).fill(true).map((el, i) => {
//    const timestamp =
//      from
//        .clone()
//        .add(i, "day")
//        .format("YYYY-MM-DDTHH:mm:ss") + ".000Z"; // DANGER api return UTC so for now is fine, but check moment formats to render 2018-01-31T00:00:00.000Z instead of 2018-01-22T00:00:00:00Z
//    const datum: Datum | undefined = data.find(
//      (el: any) => el.date === timestamp
//    );
//    return {
//      date: from.clone().add(i, "day"),
//      count: datum ? datum.count : null,
//      datum,
//      i
//    };
//  });//

//  const [springs] = useSprings(days.length, index => {
//    const item = days[index];
//    const { i, datum } = item;
//    const row = Math.floor(i / columnSize) + 1;
//    const column = Math.ceil(i % columnSize);
//    //    console.log(
//    //      "datum",
//    //      datum,
//    //      data[data.length - 1].date,
//    //      timestamp,
//    //      datum ? colorScale(datum.count) : "transparent"
//    //    );
//    return {
//      opacity: 1,
//      left: (MARGIN * 2 + WIDTH) * column + MARGIN + "px",
//      top: (WIDTH + MARGIN * 2) * 1 * row + MARGIN + "px",
//      backgroundColor: datum ? colorScale(datum.count) : "#444"
//    };
//  });
//  return springs.map((props, i) => {
//    const item = days[i];
//    return (
//      <animated.div
//        className={styles.day}
//        key={item.date.format(format)}
//        title={
//          item.date.format("YYYY-MM-DD") + " / " + (item ? item.count : "null")
//        }
//        style={
//          {
//            ...props
//          } as any
//        }
//      ></animated.div>
//    );
//  });
//}//

//export function TimelineSlider(props: TimelineProps) {
//  const beginingPeriod = moment("2010-04-19")
//    .utc()
//    .startOf("day");
//  const endPeriod = moment()
//    .utc()
//    .startOf("day");
//  const totalNumberDays = endPeriod.diff(beginingPeriod, "day");
//  const from = moment(props.dashboardQueryVariables.date[0]);
//  const to = moment(props.dashboardQueryVariables.date[1]);
//  const numberDays = to.clone().diff(from, "day");//

//  const format = "YYYY-MM-DD";
//  const updateRange = ([fromDelta, toDelta]:
//    | [number, null]
//    | [null, number]) => {
//    if (fromDelta && Number.isFinite(fromDelta)) {
//      props.dashboardQueryVariablesSetter({
//        ...props.dashboardQueryVariables,
//        date: [
//          from
//            .clone()
//            .add(fromDelta, "day")
//            .format(format),
//          to.format(format)
//        ]
//      });
//    } else if (toDelta && Number.isFinite(toDelta)) {
//      props.dashboardQueryVariablesSetter({
//        ...props.dashboardQueryVariables,
//        date: [
//          from.format(format),
//          to
//            .clone()
//            .add(toDelta, "day")
//            .format(format)
//        ]
//      });
//    }
//  };
//  totalNumberDays;
//  updateRange;
//  const fromDayCountFromBeginning = from.clone().diff(beginingPeriod, "day");
//  fromDayCountFromBeginning;
//  const singleDayWidth = props.width / totalNumberDays;
//  const leftPx = singleDayWidth * fromDayCountFromBeginning;
//  console.log("singleDayWidth", {
//    totalNumberDays,
//    singleDayWidth,
//    fromDayCountFromBeginning,
//    form: from.format(),
//    to: to.format(),
//    beginingPeriod: beginingPeriod.format(),
//    endPeriod: endPeriod.format(),
//    numberDays,
//    beg: singleDayWidth * fromDayCountFromBeginning
//  });
//  return (
//    <div className={styles.timeLineSlider}>
//      <div
//        style={{
//          left: leftPx,
//          width: singleDayWidth * numberDays
//        }}
//        className={styles.timeLinePeriod}
//      ></div>
//    </div>
//  );
//  return (
//    <div className={styles.controlsBar}>
//      <button onClick={() => updateRange([-1, null])}>+</button>
//      <button onClick={() => updateRange([1, null])}>-</button>
//      {numberDays} days from {from.format(format)} to {to.format(format)}
//      <button onClick={() => updateRange([null, -1])}>-</button>
//      <button onClick={() => updateRange([null, 1])}>+</button>
//    </div>
//  );
//}//

//function TimelineManager(props: TimelineProps) {
//  const T = Timeline as any;
//  return (
//    <div className={styles.container}>
//      <TimelineSlider {...props} />
//      <div className={styles.timelineContainer}>
//        <T {...props} />
//      </div>
//    </div>
//  );
//}//

//export default TimelineManager;
