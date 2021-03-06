import React, { useState } from "react";
import ReactDOM from "react-dom";
import { geoPath, geoMercator } from "d3-geo";
import usePopper from "../general/popper/index";
import { useSpring, animated } from "react-spring";

import {
  Dashboard,
  DashboardProjectionParams,
  DashboardMap,
  DashboardQueryVariables,
  DashboardData
} from "../../../specs/index";
import styles from "./atlas.scss";

import { scaleLinear } from "d3-scale";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";

export function getRealData(
  map: DashboardMap,
  data?: DashboardData
): Array<Datum> {
  return map.features.map((geo: any) => {
    const row = ((data || []) as Array<any>).find(
      (r: any) => r.id === geo.properties.neighbourhood
    );

    return {
      value: row
        ? parseFloat(row.avgPrice) * parseFloat(row.listingsCount)
        : null,
      id: geo.properties.neighbourhood
    };
  });
}

export interface Datum {
  value: any;
  id: string;
}
export interface PoliticalProps {
  width: number;
  height: number;
  tileSize: number;
  dashboard: Dashboard;
  dashboardProjectionParams: DashboardProjectionParams;
  dashboardMap: DashboardMap;
  dashboardQueryVariables: DashboardQueryVariables;
  dashboardData: DashboardData;
  loading: boolean;
}

export interface PoliticalPathProps {
  d: any;
  index: any;
  data: any;
  path: any;
  colorScale: any;
  dashboardData: DashboardData;
}
export interface PopupPrpos {
  d: any;
  styles: any;
  dataItem: any;
  placement: any;
}
export const Popup = React.forwardRef<any, PopupPrpos>(
  (props: PopupPrpos, ref) => {
    const { d, dataItem } = props;
    return (
      <div ref={ref} style={props.styles} className={styles.neighbourhoodPopup}>
        <div className={styles.popupHeader}> {d.properties.neighbourhood}</div>
        <div className={styles.infoPanel}>
          {!dataItem && <div className={styles.empty}>N/A</div>}
          {dataItem && (
            <div className={styles.popupStat}>
              <div>${Math.round(dataItem.avgPrice)}</div>
              <div>avg price</div>
            </div>
          )}
          {dataItem && (
            <div className={styles.popupStat}>
              <div>{Math.round(dataItem.listingsCount)}</div>
              <div>listings</div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export function PoliticalPath(props: PoliticalPathProps) {
  const { data, index, d, path, colorScale, dashboardData } = props;
  const dataObject = data[index];
  const [opacityRecordId, setOpacityRecordId] = useState<string | null>();

  const [targetNode, setTargetNode] = useState(null);
  const [menuNode, setMenuNode] = useState(null);
  const [arrowNode, setArrowNode] = useState(null);

  const { styles: popperStyles, placement, arrowStyles } = usePopper({
    referrenceNode: targetNode,
    popperNode: menuNode,
    arrowNode
  }) as any;
  //console.log(popperStyles, arrowStyles, placement);
  setArrowNode;
  styles;
  placement;
  arrowStyles;
  const dataItem = ((dashboardData || []) as Array<any>).find(
    el => el.id === d.properties.neighbourhood
  );
  const style = useSpring({ opacity: 1 });
  return (
    <React.Fragment>
      <animated.path
        style={style}
        ref={setTargetNode as any}
        d={path(d) as any}
        className={styles.politicalPath}
        onMouseEnter={() => {
          setOpacityRecordId(d.properties.neighbourhood);
        }}
        onMouseLeave={() => {
          setOpacityRecordId(null);
        }}
        onClick={() => {}}
        fill={
          dataObject
            ? (colorScale(dataObject.value) as any)
            : "rgba(255,255,255,1)"
        }
        //fill="transparent"
        stroke={"black"}
        strokeWidth={1}
      />
      {opacityRecordId &&
        ReactDOM.createPortal(
          <Popup
            key={"j"}
            ref={setMenuNode as any}
            styles={popperStyles}
            d={d}
            dataItem={dataItem}
            placement={placement}
          ></Popup>,
          document.body.firstElementChild as any
        )}
    </React.Fragment>
  );
}

export function Political(props: PoliticalProps) {
  const {
    dashboardMap,
    dashboardProjectionParams,
    //dashboardQueryVariables,
    dashboardData
  } = props;
  if (!dashboardData || !dashboardMap) {
    return null;
  }
  const data = getRealData(dashboardMap, dashboardData);
  const domain = [
    Math.min.apply(null, data.map((el: any) => el.value)),
    Math.max.apply(null, data.map((el: any) => el.value))
  ];

  let range = [`rgba(135, 206, 235,${1})`, `rgba(205,92,92,${1})`] as any;
  range = ["#ed3a3c", "#fce14c"].reverse() as any;
  var colorScale = scaleLinear()
    .range(range)
    .domain(domain);

  const { scale, translate } = dashboardProjectionParams;

  const projection = geoMercator()
    .scale(scale / (Math.PI * 2))
    .translate(translate);
  const p = geoPath(projection);

  return (
    <g key="a" className="counties2">
      {dashboardMap.features.map((d: any, i: number) => {
        return (
          <PoliticalPath
            key={i}
            path={p}
            d={d}
            dashboardData={dashboardData}
            index={i}
            data={data}
            colorScale={colorScale}
          />
        );
      })}
    </g>
  );
}

import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
const GET_AGGREGATIONS = gql`
  query AggregationsQuery($cityName: String!) {
    aggregateListings(
      cityNameValue: $cityName
      fromDateValue: "2014-01-01"
      toDateValue: "2018-12-30"
      roomTypeValue: "Entire home/apt"
    ) {
      nodes {
        avgPrice
        listingsCount
        id
        roomType
      }
    }
  }
`;

type PathParamsType = {
  cityName: string;
};

// Your component own properties
type PoliticalApolloProps = RouteComponentProps<PathParamsType> &
  PoliticalProps & {};

function PoliticalApollo(props: PoliticalApolloProps) {
  const { cityName } = props.match.params;
  const { data, error, loading } = useQuery(GET_AGGREGATIONS, {
    fetchPolicy: "cache-first",
    variables: { cityName: cityName }
  });
  error;
  const p = {
    ...props,
    loading,
    dashboardData:
      data && data.aggregateListings ? data.aggregateListings.nodes : null
  };

  return <Political {...p} />;
}

export default withRouter(PoliticalApollo);
