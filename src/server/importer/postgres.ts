import knex from "knex";
import parallelLimit from "async/parallelLimit";
import boot from "./index";
type Knex = any;
export async function getDB(): Promise<Knex> {
  var pg = knex({
    client: "pg",
    pool: { min: 0, max: 7 },
    connection: process.env.DATABASE_URL || "postgres://localhost:5432/data"
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
    .from("users")
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

  const insertTasks = inserts.map((id: any) => {
    return async function(callback: Function) {
      const data = dataset.find(el => el.id === id);
      console.log("doing", id);
      client("users")
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
      client("users")
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
  await client.schema.createTable("users", function(table) {
    table.string("id").primary();
    table.string("listing_id");
    table.string("checksum");
    table.date("date");
    table.string("city");
    table.string("neighbourhood");
    table.string("room_type");
    table.decimal("price");

    table.index("checksum");
    table.index("date");
    table.index("neighbourhood");
    table.index("room_type");
    table.index("price");
  });
}

(async () => {
  const client = await getDB();
  await createIndex(client);
  await boot(client, doPublishWork);
})();
export const qq = {
  aggs: {
    group_by_state: {
      terms: {
        field: "room_type",
        order: {
          average_price: "desc"
        }
      },
      aggs: {
        average_price: {
          avg: {
            field: "price"
          }
        },
        group_by_neighbourhood: { terms: { field: "neighbourhood" } }
      }
    }
  }
};
