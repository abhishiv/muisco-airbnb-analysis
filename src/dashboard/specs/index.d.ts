export interface DashboardQuery {
  cities: string[];
  roomTypes: string[];
  date: [string, string];
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
