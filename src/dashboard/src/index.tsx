import React, { useState, useEffect } from "react";
export interface DashboardViewProps {}

import { Dashboard, DashboardQuery } from "../specs/index";
import Layout from "./components/layout/index";

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
    <React.Fragment>
      {dashboardQuery && dashboard && (
        <Layout
          {...({
            dashboard,
            dashboardQuery,
            dashboardQuerySetter: setDashboardQuery
          } as any)}
        />
      )}
    </React.Fragment>
  );
}
