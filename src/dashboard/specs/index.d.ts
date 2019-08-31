export interface DashboardQueryVariables {
  cities: string[];
  cityName: string;
  roomTypes: string[];
  date: [string, string];
  center: [number, number];
  zoom: number;
}

export interface DashboardData {
  payload: any;
}

export interface DashboardMap {
  city: string;
  geojson: any;
}

export interface DashboardQueryVariablesSetter {
  (query: DashboardQueryVariables): void;
}

export interface City {
  name: string;
  location: [number, number];
  geojson: any;
}

export interface Query {
  name: string;
  returnType: any;
}

export interface DashboardResult {
  data: DashboardData;
  map: DashboardMap;
  variables: DashboardQueryVariables;
}

export interface Dashboard {
  id: string;
  defaultQueryVariables: DashboardQueryVariables;
  cities: City[];
  queries: Query[];
}

export interface DashboardProjectionParams {
  scale: number;
  translate: [number, number];
}

export interface DashboardProjectionParamsSetter {
  (parmas: DashboardProjectionParams): void;
}
