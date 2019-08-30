import React, { useState, useEffect } from "react";
export interface DashboardViewProps {}
import Timeline from "./components/timeline/index";

import { Dashboard, DashboardQuery } from "../specs/index";

export async function fetchDashboard(): Promise<Dashboard> {
  const req = await fetch("/_api/airbnb");
  const json = await req.json();
  return json as Dashboard;
}

export default function DashboardView(props: DashboardViewProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboardQuery, setDashboardQuery] = useState<DashboardQuery | null>(
    null
  );
  const doAsyncAction = async () => {
    const dashboard = await fetchDashboard();
    setDashboard(dashboard);
    setDashboardQuery(dashboard.defaultQuery);
  };
  useEffect(() => {
    doAsyncAction();
  }, []);
  return (
    <div>
      {dashboardQuery && dashboard && (
        <Timeline
          dashboardQuerySetter={setDashboardQuery}
          dashboard={dashboard}
          dashboardQuery={dashboardQuery}
        />
      )}
    </div>
  );
}
