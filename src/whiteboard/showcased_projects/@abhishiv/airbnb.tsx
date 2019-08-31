export interface Database {
  type: string;
  name: string;
  connectionString: string;
}
export interface EnvironmentVariables {
  [name: string]: any;
}
export interface QueryMeta {
  [name: string]: any;
}
export interface Query {
  databaseName: string;
  stringified: string;
  name: string;
  meta: QueryMeta;
}
export interface QueryVariables {
  [name: string]: any;
}
export interface Project {
  env: EnvironmentVariables;
  databases: Array<Database>;
  queries: Array<Query>;
  defaultQueryVariables: QueryVariables;
}
const project: Project = {
  env: {},
  databases: [
    {
      name: "postgres",
      type: "postgres",
      connectionString: "DATABASE_URL"
    }
  ],
  queries: [
    {
      databaseName: "postgres",
      stringified: `
select count(*), date from users where room_type in ({toSQLList(
          variables.roomTypes
        )}) and  city in ({toSQLList(variables.cities)}) and date >= '{
          variables.date[0]
        }' and date < '{
          variables.date[1]
        }' group by date(date) order by date asc`,
      name: "by_date",
      meta: {}
    },
    {
      databaseName: "postgres",
      stringified: `
select count(neighbourhood), room_type, neighbourhood from users where room_type in ({toSQLList(
          variables.roomTypes
        )}) and  city in ({toSQLList(variables.cities)}) and date >= '{
          variables.date[0]
        }' and date < '{variables.date[1]}'  group by GROUPING SETS (
         (room_type, neighbourhood), (neighbourhood, room_type)
 )`,
      name: "diced",
      meta: {}
    }
  ],
  defaultQueryVariables: { cityName: "milan" }
};

export default project;

export const code = `
CREATE FUNCTION aggregatelistings(roomtypevalue text, 
fromdatevalue date, 
todatevalue   date, 
citynamevalue text) 
returns TABLE (listings_count bigint, avg_price numeric, neighbourhood text, room_type text) AS $$ 
SELECT   count(neighbourhood) AS listings_count, 
         avg(price)::numeric           AS avg_price, 
         room_type, 
         neighbourhood 
FROM     users 
WHERE    room_type=$1 
AND      date >= $2 
AND      date < $3 
AND      city=$4
GROUP BY grouping sets ( (room_type, neighbourhood), (neighbourhood, room_type) ) $$ language sql stable;

`;
