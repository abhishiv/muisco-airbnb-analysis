export interface DataSource {}

export interface AtlasMap {
  topojsonURL: string;
  topojsonObjectProp: string;
  topojsonIdProp: any[];
  topojson: any;
  features: any;
  //  topojson: "https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/world-countries-sans-antarctica.json";
  //  topojsonIdProp: ["properties", "Alpha-2"];
}
export interface Atlas {
  entities: AtlasMap[];
  entityPath: string[];
}
export interface Dashboard {
  dataSources: DataSource[];
  atlas: Atlas;
}
