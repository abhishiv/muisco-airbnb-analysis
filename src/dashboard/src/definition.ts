const toSQLList = (list: any[]) => list.map(el => `'${el}'`).join(", ");
export default {
  id: "airbnb",
  defaultQuery: {
    cities: ["milano"],
    roomTypes: ["Shared room", "Entire home/apt"],
    cityName: "milano",
    date: ["2017-08-01", "2018-01-30"],

    center: [45.4642, 9.19],
    zoom: 4
  },
  cities: [
    {
      name: "milano",
      location: [45.4642, 9.19],
      geojson:
        "/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/neighbourhoods.geojson"
    }
  ],
  queries: [
    {
      name: "by_date",
      returnType: {
        properties: {
          count: { type: "number" },
          date: { type: "string" }
        }
      },
      computer: (variables: any) => {
        return `select count(*), date from users where room_type in (${toSQLList(
          variables.roomTypes
        )}) and  city in (${toSQLList(variables.cities)}) and date >= '${
          variables.date[0]
        }' and date < '${
          variables.date[1]
        }' group by date(date) order by date asc`;
      }
    },

    {
      name: "diced",
      returnType: {
        properties: {
          count: { type: "number" },
          room_type: { type: "string" },
          neighbourhood: { type: "string" }
        }
      },
      computer: (variables: any) => {
        return `select          avg(price)::numeric           AS avg_price, count(neighbourhood), room_type, neighbourhood from users where room_type in (${toSQLList(
          variables.roomTypes
        )}) and  city in (${toSQLList(variables.cities)}) and date >= '${
          variables.date[0]
        }' and date < '${variables.date[1]}'  group by GROUPING SETS (
         (room_type, neighbourhood), (neighbourhood, room_type)
 )`;
      }
    }
  ]
};
