import knex from "knex";
import parallelLimit from "async/parallelLimit";
import boot, { getDashboard, getTopographies } from "./index";
type Knex = any;
export async function getDB(): Promise<Knex> {
  var pg = knex({
    client: "pg",
    pool: { min: 0, max: 7 },
    connection:
      process.env.DATABASE_URL ||
      "postgres://admin:BDUPRYOYYJPUXRZG@aws-us-east-1-portal.29.dblayer.com:34428/compose"
  });
  return pg as Knex;
}

export async function doPublishWork(
  client: Knex,
  dataset: any[],
  indexName: string
) {
  console.log("computed dataset", dataset.length);
  const existingRecords = await client
    .select("id", "checksum")
    .from("reviews")
    .where(client.raw("id = ANY(?)", [dataset.map(el => el.id)]));
  const existingIds = existingRecords.map((el: any) => el.id);
  console.log("existingIds", existingIds.length);

  const inserts = dataset
    .map(el => el.id)
    .filter(el => existingIds.indexOf(el) === -1);
  const updates = dataset
    .map(el => el.id)
    .filter(id => {
      const record = existingRecords.find((el: any) => el.id === id);
      const data = dataset.find(el => el.id === id);
      return existingIds.indexOf(id) > -1 && record.checksum !== data.checksum;
    });
  console.log(
    "work to do inserts = ",
    inserts.length,
    "updates = ",
    updates.length
  );

  const insertTasks = inserts.map((id: any) => {
    return async function(callback: Function) {
      const data = dataset.find(el => el.id === id);
      console.log("doing", id, data);
      client("reviews")
        .insert(data)
        .then(function(resp: any) {
          callback(null, resp);
        })
        .catch((err: any) => callback(null, err));
    };
  });
  const insertsResults = await parallelLimit(insertTasks, 40);
  insertsResults;
  console.log("insertsResults");
  const updateTasks = updates.map((id: any) => {
    return async function(callback: Function) {
      const data = dataset.find(el => el.id === id);
      client("reviews")
        .insert(data)
        .then(function(resp: any) {
          callback(null, resp);
        })
        .catch((err: any) => callback(null, err));
    };
  });
  const updateResults = await parallelLimit(updateTasks, 40);
  updateResults;
  console.log("updateResults");
}
export async function createIndex(client: Knex) {
  console.log("creating schema");

  const dashboard = await getDashboard();

  await client("dashboards").insert({
    id: dashboard.id,
    definition: dashboard
  });

  console.log("created schema");
  // TODO: add code, code2 queries from bottom of this file as well
}

(async () => {
  const client = await getDB();
  try {
    await createIndex(client);
  } catch (e) {
    console.log("index already exists, skipping", e);
  }

  await boot(client, doPublishWork);
})();

export const code = `
CREATE FUNCTION aggregate_listings(room_type_value text, 
from_date_value date, 
to_date_value   date, 
city_name_value text) 
returns TABLE (listings_count bigint, avg_price numeric, room_type text, neighbourhood text) AS $$ 
SELECT   count(neighbourhood) AS listings_count, 
         avg(price)::numeric           AS avg_price, 
         room_type, 
         neighbourhood 
FROM     reviews 
WHERE    room_type=$1 
AND      date >= $2 
AND      date < $3 
AND      city=$4
GROUP BY grouping sets ( (room_type, neighbourhood), (neighbourhood, room_type) ) $$ language sql stable;

`;

export const code2 = `
CREATE FUNCTION group_listings_date(city_name_value text) 
returns TABLE (count bigint, date TIMESTAMP WITH TIME ZONE) AS $$ 
SELECT   count(*), 
         date::timestamp AT TIME ZONE 'UTC' AS date 
FROM     reviews 
WHERE    city=$1
GROUP BY date(date) order by date asc $$ language sql stable;
`;

// pg_dump airbnb --no-acl --no-privileges > airbnb-milan-berlin.sq
// psql -d 'postgres://admin:xxx@aws-us-east-1-portal.29.dblayer.com:34428/compose' -f airbnb-milan-berlin.sq
