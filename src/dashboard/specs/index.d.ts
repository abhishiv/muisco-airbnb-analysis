export interface DashboardQuery {
  cities: string[];
  cityName: string;
  roomTypes: string[];
  date: [string, string];
  center: [number, number];
  zoom: number;
}

export interface DashboardMap {
  city: string;
  geojson: any;
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

export interface DashboardProjectionParams {
  scale: number;
  translate: [number, number];
}

export interface DashboardProjectionParamsSetter {
  (parmas: DashboardProjectionParams): void;
} 
