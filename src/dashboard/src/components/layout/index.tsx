import React from "react";
export interface LayoutProps {}

import Timeline from "../../components/timeline/index";
import {
  Dashboard,
  DashboardQuery,
  DashboardQuerySetter,
  DashboardMap,
  DashboardProjectionParams
} from "../../../specs/index";
import Atlas from "../../components/atlas/index";
import styles from "./layout.scss";
styles;

export interface LayoutProps {
  dashboardQuery: DashboardQuery;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
  dashboardMap: DashboardMap;
  width: number;
  height: number;
  dashboardProjectionParams: DashboardProjectionParams;
}

function Layout(props: LayoutProps) {
  return (
    <React.Fragment>
      {props.dashboardProjectionParams && (
        <Atlas {...props} height={props.height} width={props.width} />
      )}
      {false && props.dashboardProjectionParams && (
        <Timeline {...props} height={props.height} width={props.width} />
      )}
    </React.Fragment>
  );
}
export default Layout;
