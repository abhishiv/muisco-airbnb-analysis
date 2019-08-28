import React from "react";
import Dimensions from "react-dimensions";

import Map from "./components/map/index";
import { Dashboard, AtlasMap } from "../specs/index";
import dashboard from "./dashboard";
import { feature } from "topojson-client";

export interface WorldMapProps {
  containerWidth: number;
  containerHeight: number;
}

export interface WorldMapState {
  dashboard: Dashboard;
}
export async function fetchTopoJSON(url: string) {
  const req = await fetch(url);
  const topojsonData = await req.json();
  return topojsonData;
}
export async function getNextEntity(
  path: any[],
  id?: string
): Promise<AtlasMap | null> {
  console.log("path", path, id);
  if (path.join("/") === "" && !id) {
    const topojsonURL =
      "https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/world-countries-sans-antarctica.json";
    const topojsonData = await fetchTopoJSON(topojsonURL);
    return {
      topojsonURL,
      topojson: topojsonData,
      topojsonObjectProp: "countries1",
      topojsonIdProp: ["properties", "Alpha-2"],
      features: feature(topojsonData, topojsonData.objects["countries1"])
    };
  } else if (path.join("/") === "" && id === "IT") {
    const topojsonURL =
      "http://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/italy/italy-regions.json";
    const topojsonData = await fetchTopoJSON(topojsonURL);
    return {
      topojsonURL,
      topojson: topojsonData,
      topojsonObjectProp: "ITA_adm1",
      topojsonIdProp: ["properties", "NAME_1"],
      features: feature(topojsonData, topojsonData.objects["ITA_adm1"])
    };
  } else if (path.join("/") === "IT" && id) {
    const topojsonURL =
      "http://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/italy/italy-provinces.json";
    const topojsonData = await fetchTopoJSON(topojsonURL);
    return {
      topojsonURL,
      topojson: topojsonData,
      topojsonObjectProp: "ITA_adm2",
      topojsonIdProp: ["properties", "NAME_2"],
      features: feature(topojsonData, {
        type: "GeometryCollection",
        geometries: topojsonData.objects["ITA_adm2"].geometries.filter(
          (d: any) => d.properties.NAME_1 === id
        )
      })
    };
  } else if (path.join("/") === "" && id === "IN") {
    const topojsonURL =
      "http://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/india/india-states.json";
    const topojsonData = await fetchTopoJSON(topojsonURL);
    return {
      topojsonURL,
      topojson: topojsonData,
      topojsonObjectProp: "IND_adm1",
      topojsonIdProp: ["properties", "NAME_1"],
      features: feature(topojsonData, topojsonData.objects["IND_adm1"])
    };
  } else if (path.join("/") === "IN" && id) {
    const topojsonURL =
      "http://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/india/india-districts.json";
    const topojsonData = await fetchTopoJSON(topojsonURL);
    return {
      topojsonURL,
      topojson: topojsonData,
      topojsonObjectProp: "IND_adm2",
      topojsonIdProp: ["properties", "NAME_2"],
      features: feature(topojsonData, {
        type: "GeometryCollection",
        geometries: topojsonData.objects["IND_adm2"].geometries.filter(
          (d: any) => d.properties.NAME_1 === id
        )
      })
    };
  } else {
    return null;
  }
}
class WorldMap extends React.Component<any, WorldMapState> {
  constructor(props: WorldMapProps) {
    super(props);
    this.state = { dashboard };
  }
  updateMap = (map: AtlasMap, id?: string) => {
    this.setState({
      dashboard: {
        ...this.state.dashboard,
        atlas: {
          ...this.state.dashboard.atlas,
          entityPath: [
            ...this.state.dashboard.atlas.entityPath,
            ...(id ? [id] : [])
          ],
          map
        }
      }
    });
  };
  componentDidMount = async () => {
    const map = await getNextEntity(this.state.dashboard.atlas.entityPath);
    if (map) {
      this.updateMap(map);
    }
  };
  render() {
    if (!this.state.dashboard.atlas.map) {
      return null;
    }
    return (
      <Map
        dashboard={this.state.dashboard}
        getNextEntity={async (id: string) => {
          const map = await getNextEntity(
            this.state.dashboard.atlas.entityPath,
            id
          );
          if (map) {
            this.updateMap(map, id);
          }
        }}
        width={this.props.containerWidth}
        height={this.props.containerHeight}
      />
    );
  }
}
export default Dimensions()(WorldMap);
