import { Client } from "@elastic/elasticsearch";
import boot from "./index";
export async function getDB() {
  const client = new Client({
    //node: "http://localhost:9200/"
    node:
      "https://abhishiv:abhishiv@portal962-35.alluring-elastic-search-76.1792442523.composedb.com:34406/"
  });
  return client;
}

export async function doPublishWork(
  client: any,
  dataset: any[],
  indexName: string
) {
  console.log("computed dataset", dataset.length);
  const body = dataset.flatMap(doc => [
    { index: { _index: indexName, _type: "item", _id: doc.id } },
    doc
  ]);
  console.log("making requ");
  const { body: bulkResponse } = await client.bulk({ refresh: "true", body });
  console.log("req done"); //

  if (bulkResponse.errors) {
    const erroredDocuments: any[] = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action: any, i: any) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        });
      }
    });
    console.log(erroredDocuments);
  } //
}
export async function createIndex(client: any) {
  await client.indices.create(
    {
      index: "list",
      body: {
        mappings: {
          item: {
            properties: {
              id: { type: "text" },
              listing_id: { type: "text" },
              date: { type: "date" },
              city: { type: "keyword" },
              checksum: { type: "text" },
              neighbourhood: { type: "keyword" },
              room_type: { type: "keyword" },
              price: { type: "integer" }
            }
          }
        }
      }
    },
    { ignore: [400] }
  );
}
(async () => {
  const client = await getDB();
  //await createIndex(client);
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
