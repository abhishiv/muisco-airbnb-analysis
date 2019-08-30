import React from "react";
export interface DashboardViewProps {}
import Timeline from "./components/timeline/index";
export default function DashboardView(props: DashboardViewProps) {
  return (
    <div>
      <Timeline />
    </div>
  );
}
