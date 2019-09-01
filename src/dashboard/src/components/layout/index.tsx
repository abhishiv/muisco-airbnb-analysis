import React from "react";
export interface LayoutProps {}

import Timeline from "../../components/timeline/index";
import {
  Dashboard,
  DashboardQueryVariables,
  DashboardQueryVariablesSetter,
  DashboardMap,
  DashboardProjectionParams,
  DashboardProjectionParamsSetter,
  DashboardData
} from "../../../specs/index";
import Atlas from "../atlas/index";
import styles from "./layout.scss";
import Knobs from "../knobs/index";
styles;

export interface LayoutProps {
  dashboardQueryVariables: DashboardQueryVariables;
  dashboard: Dashboard;
  dashboardQueryVariablesSetter: DashboardQueryVariablesSetter;
  dashboardMap: DashboardMap;
  width: number;
  height: number;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardProjectionParamsSetter: DashboardProjectionParamsSetter;
  dashboardData: DashboardData;
}

function Layout(props: LayoutProps) {
  return (
    <React.Fragment>
      {props.dashboardProjectionParams && (
        <Atlas {...props} height={props.height} width={props.width} />
      )}
      {props.dashboardProjectionParams && false && (
        <Timeline {...props} height={props.height} width={props.width} />
      )}
      <Knobs />
    </React.Fragment>
  );
}
export default Layout;
