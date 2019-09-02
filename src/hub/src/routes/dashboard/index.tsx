import React from "react";
import DashboardComponent from "../../../../dashboard/src/index";
import { RouteComponentProps } from "react-router-dom";
export interface DashboardProps extends RouteComponentProps {}
export default function Dashboard(props: DashboardProps) {
  return <DashboardComponent {...props} />;
}
