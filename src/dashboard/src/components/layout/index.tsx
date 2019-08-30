import React, { useState } from "react";
export interface LayoutProps {}
import Measure from "react-measure";
import Timeline from "../../components/timeline/index";
import {
  Dashboard,
  DashboardQuery,
  DashboardQuerySetter
} from "../../../specs/index";
import Atlas from "../../components/atlas/index";
import styles from "./layout.scss";
styles;

export interface LayoutProps {
  dashboardQuery: DashboardQuery;
  dashboard: Dashboard;
  dashboardQuerySetter: DashboardQuerySetter;
  containerWidth: number;
  containerHeight: number;
}

function Layout(props: LayoutProps) {
  const [dimensions, setDimensions] = useState();
  return (
    <Measure
      bounds
      onResize={(contentRect: any) => {
        setDimensions(contentRect.bounds);
      }}
    >
      {({ measureRef }: { measureRef: any }) => (
        <div ref={measureRef}>
          <React.Fragment>
            <Atlas
              {...props}
              containerHeight={dimensions && dimensions.height}
              containerWidth={dimensions && dimensions.width}
            />
            {dimensions && (
              <Timeline
                {...props}
                containerHeight={dimensions && dimensions.height}
                containerWidth={dimensions && dimensions.width}
              />
            )}
          </React.Fragment>
        </div>
      )}
    </Measure>
  );
}
export default Layout;
