import { ExtendedFeatureCollection } from "d3-geo";
export interface DashboardQueryVariables {
  cityName: string;
  roomType: string;
  from: string;
  to: string;
}

export type DashboardMap = ExtendedFeatureCollection;

export interface Dashboard {
  id: string;
  defaultQueryVariables: DashboardQueryVariables;
  meta: {
    cities: { name: string; id: string; icon: string }[];
  };
}

export interface DashboardProjectionParams {
  scale: number;
  translate: [number, number];
}

export interface DashboardProjectionParamsSetter {
  (parmas: DashboardProjectionParams): void;
}

export interface DashboardData {}
