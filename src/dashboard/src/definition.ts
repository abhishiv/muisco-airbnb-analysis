const toSQLList = (list: any[]) => list.map(el => `'${el}'`).join(", ");
export default {
  id: "airbnb",
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
      computer: (variables: any) => {
        return `select count(neighbourhood), room_type, neighbourhood from users where room_type in (${toSQLList(
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
