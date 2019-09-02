import React from "react";
export interface LayoutProps {}

import Timeline from "../../components/timeline/index";
Timeline;
import {
  Dashboard,
  DashboardQueryVariables,
  DashboardMap,
  DashboardProjectionParams,
  DashboardProjectionParamsSetter
} from "../../../specs/index";
import Atlas from "../atlas/index";
import styles from "./layout.scss";
import Knobs from "../knobs/index";
styles;

export interface LayoutProps {
  dashboardQueryVariables: DashboardQueryVariables;
  dashboard: Dashboard;
  dashboardMap: DashboardMap;
  width: number;
  height: number;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardProjectionParamsSetter: DashboardProjectionParamsSetter;
}

function Layout(props: LayoutProps) {
  return (
    <React.Fragment>
      {props.dashboardProjectionParams && (
        <Atlas {...props} height={props.height} width={props.width} />
      )}
      <Knobs />
    </React.Fragment>
  );
}
//      {props.dashboardProjectionParams && false && (
//        //<Timeline {...props} height={props.height} width={props.width} />
//      )}
export default Layout;
