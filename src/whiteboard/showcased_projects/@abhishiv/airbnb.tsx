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
  defaultQueryVariablesVariables: QueryVariables;
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
  defaultQueryVariablesVariables: { cityName: "milan" }
};

export default project;

