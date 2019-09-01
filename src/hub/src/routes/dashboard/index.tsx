import React from "react";

import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

const GET_DASH = gql`
  query MyQuery {
    aggregateListings(
      roomTypeValue: "Entire home/apt"
      fromDateValue: "2014-02-01"
      toDateValue: "2024-02-01"
      cityNameValue: "milano"
    ) {
      nodes {
        avgPrice
        listingsCount
        roomType
        neighbourhood
      }
    }
  }
`;

export interface DashboardProps {}
export default function Dashboard(props: DashboardProps) {
  const { data, error, loading } = useQuery(GET_DASH, {
    variables: {}
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  return <div>dashboard</div>;
}
