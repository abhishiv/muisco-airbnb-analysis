import React from "react";
export interface LayoutProps {}

import Timeline from "../../components/timeline/index";
import {
  Dashboard,
  DashboardQuery,
  DashboardQuerySetter,
  DashboardMap,
  DashboardProjectionParams,
  DashboardProjectionParamsSetter
} from "../../../specs/index";
import Atlas from "../atlas/index";
import styles from "./layout.scss";
import Knobs from "../knobs/index";
styles;

export interface LayoutProps {
  dashboardQuery: DashboardQuery;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
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
      {props.dashboardProjectionParams && (
        <Timeline {...props} height={props.height} width={props.width} />
      )}
      <Knobs />
    </React.Fragment>
  );
}
export default Layout;
