export interface DashboardQueryVariables {
  cityName: string;
  roomType: string;
  from: string;
  to: string;
}

export interface Dashboard {
  id: string;
  defaultQueryVariables: DashboardQueryVariables;
}


