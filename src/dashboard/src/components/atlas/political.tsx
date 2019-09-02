import React, { useState } from "react";
import ReactDOM from "react-dom";
import { geoPath, geoMercator } from "d3-geo";
import usePopper from "../general/popper/index";

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
// Type whatever you expect in 'this.props.match.params.*'

export function getRealData(
  map: DashboardMap,
  data: DashboardData
): Array<Datum> {
  return map.features.map((geo: any) => {
    const row = (data as Array<any>).find(
      (r: any) => r.neighbourhood === geo.properties.neighbourhood
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
  datum: Datum;
  active: boolean;
  path: any;
  colorScale: any;
}
export function PoliticalPath(props: PoliticalPathProps) {
  const { datum, d, path, colorScale } = props;
  const dataObject = datum;
  const [opacityRecordId, setOpacityRecordId] = useState<string | null>();

  const [targetNode, setTargetNode] = useState(null);
  const [menuNode, setMenuNode] = useState(null);
  const [arrowNode, setArrowNode] = useState(null);

  const { styles: popperStyles, placement, arrowStyles } = usePopper({
    referrenceNode: targetNode,
    popperNode: menuNode,
    arrowNode
  }) as any;
  setArrowNode;
  styles;
  placement;
  arrowStyles;
  const st = {
    opacity: opacityRecordId === d.properties.neighbourhood ? 1 : 0.5
  };
  return (
    <React.Fragment>
      <path
        ref={setTargetNode as any}
        d={path(d) as any}
        style={st}
        className={styles.politicalPath}
        onMouseEnter={() => {
          setOpacityRecordId(d.properties.neighbourhood);
        }}
        onMouseLeave={() => setOpacityRecordId(null)}
        onClick={() => {}}
        fill={colorScale(dataObject.value) as any}
        //fill="transparent"
        stroke={"black"}
        strokeWidth={1}
      />
      {opacityRecordId &&
        ReactDOM.createPortal(
          <div
            ref={setMenuNode as any}
            style={popperStyles}
            className={styles.neighbourhoodPopup}
            data-placement={placement}
          >
            {d.properties.neighbourhood}
          </div>,
          document.body
        )}
    </React.Fragment>
  );
}

export function Political(props: PoliticalProps) {
  const {
    dashboardMap,
    dashboardProjectionParams,
    //dashboardQueryVariables,
    dashboardData,
    loading
  } = props;
  if (!loading) {
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
      <g className="counties">
        {dashboardMap.features.map((d: any, i: number) => {
          return (
            <PoliticalPath
              key={i}
              path={p}
              d={d}
              datum={data[i]}
              colorScale={colorScale}
              active={false}
            />
          );
        })}
      </g>
    );
  } else {
    const { scale, translate } = dashboardProjectionParams;

    const projection = geoMercator()
      .scale(scale / (Math.PI * 2))
      .translate(translate);
    const p = geoPath(projection);

    return (
      <g className="counties">
        {dashboardMap.features.map((d: any, i: number) => {
          const st = {};
          return (
            <path
              key={i}
              d={p(d) as any}
              style={st}
              className={styles.politicalPath}
              onClick={() => {}}
              fill={`rgba(255,255,255, 0.2)`}
              stroke={"black"}
              strokeWidth={1}
            />
          );
        })}
      </g>
    );
  }
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
        neighbourhood
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
  const { data, error, loading, refetch } = useQuery(GET_AGGREGATIONS, {
    fetchPolicy: "cache-first",
    variables: { cityName: cityName }
  });
  error;
  React.useEffect(() => {
    refetch();
  }, [cityName]);
  const p = {
    ...props,
    loading,
    dashboardData:
      data && data.aggregateListings ? data.aggregateListings.nodes : null
  };

  return <Political {...p} />;
}

export default withRouter(PoliticalApollo);
