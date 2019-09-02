import React from "react";
import DashboardComponent from "../../../../dashboard/src/index";
import { RouteComponentProps } from "react-router-dom";
export interface DashboardProps extends RouteComponentProps {}
export default function Dashboard(props: DashboardProps) {
  React.useEffect(() => {
    console.log("DashboardRoute");
  }, []);
  return (
    <div
      style={{
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <DashboardComponent {...props} />
    </div>
  );
}
