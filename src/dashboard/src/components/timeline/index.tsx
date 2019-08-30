import React from "react";
import {
  DashboardQuery,
  Dashboard,
  DashboardQuerySetter
} from "../../../specs/index";
export interface TimelineProps {
  dashboardQuery: DashboardQuery;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
}
export default function Timeline(props: TimelineProps) {
  return <div>timeline</div>;
}
