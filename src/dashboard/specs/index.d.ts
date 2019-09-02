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
  meta: any;
}

export interface DashboardProjectionParams {
  scale: number;
  translate: [number, number];
}

export interface DashboardProjectionParamsSetter {
  (parmas: DashboardProjectionParams): void;
}
