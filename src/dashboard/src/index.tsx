import React from "react";

import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { parse } from "query-string";
import { RouteComponentProps } from "react-router-dom";
import DashboardComponent from "./dashboard";

const GET_DASH_QUERY = gql`
  query DashboardQuery {
    dashboardById(id: "airbnb") {
      id
      definition
    }
  }
`;

const GET_TOPOGRAPHY_QUERY = gql`
  query TopographyQuery($cityName: String!) {
    topographyById(id: $cityName) {
      id
      payload
    }
  }
`;

export interface DashboardProps extends RouteComponentProps<any> {}
export default function Dashboard(props: DashboardProps) {
  const {
    data: dashboardData,
    error: dashboardError,
    loading: dashboardLoading
  } = useQuery(GET_DASH_QUERY, {
    fetchPolicy: "cache-first"
  });
  const variables: { [key: string]: any } = {
    cityName: props.match.params.cityName,
    ...(props.location.search ? parse(props.location.search) : {})
  };

  const {
    data: topographyData,
    error: topographyError,
    loading: topographyLoading,
    refetch: refetchTopography
  } = useQuery(GET_TOPOGRAPHY_QUERY, {
    fetchPolicy: "cache-first",
    variables
  });
  React.useEffect(() => {
    refetchTopography();
  }, Object.keys(variables).map(key => variables[key]));

  if (dashboardError || topographyError) {
    const error = dashboardError || topographyError;
    return <div>Error! {error ? error.message : "error"}</div>;
  }
  const p = {
    ...props,
    loading: dashboardLoading || topographyLoading,
    dashboard: !dashboardData
      ? null
      : JSON.parse(dashboardData.dashboardById.definition),
    dashboardMap: !topographyData
      ? null
      : JSON.parse(topographyData.topographyById.payload),
    variables,
    setVariables: () => {
      console.log("setVariables");
    }
  };
  return <DashboardComponent {...p} />;
}
