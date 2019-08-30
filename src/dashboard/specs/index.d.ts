export interface DashboardQuery {
  cities: string[];
  cityName: string;
  roomTypes: string[];
  date: [string, string];
  center: [number, number];
  zoom: number;
}

export interface DashboardQuerySetter {
  (query: DashboardQuery): void;
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
export interface Dashboard {
  id: string;
  defaultQuery: DashboardQuery;
  cities: City[];
  queries: Query[];
}
