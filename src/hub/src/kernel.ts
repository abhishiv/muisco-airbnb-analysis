import parse from "csv-parse";

export function parseCSV(text: string) {
  return new Promise(function(resolve, reject) {
    const output: any[] = [];
    parse(text, {
      trim: true,
      skip_empty_lines: true
    })
      // Use the readable stream api
      .on("readable", function() {
        let record;
        while ((record = this.read())) {
          output.push(record);
        }
      })
      // When we are done, test that the parsed output matched what expected
      .on("end", function() {
        resolve(output);
      })
      .on("error", (e: any) => reject(e));
  });
}
declare var lf: any;
export async function loadIntoLFDb(
  db: any,
  item: any,
  list: any[],
  headers: any[]
): Promise<any> {
  const rows = list.map(el => {
    return item.createRow({
      id: el[0] + "/" + el[1],
      listing_id: el[0],
      date: new Date(el[1])
    });
  });
  await db
    .insertOrReplace()
    .into(item)
    .values(rows)
    .exec();
  return db;
}

export async function lfTest(list: any, header: any) {
  var schemaBuilder = lf.schema.create("items2323", 3);

  schemaBuilder
    .createTable("reviews")
    .addColumn("id", lf.Type.STRING)
    .addColumn("listing_id", lf.Type.INTEGER)
    .addColumn("date", lf.Type.DATE_TIME)
    .addPrimaryKey(["id"])
    .addIndex("idxListing", ["listing_id"], false, lf.Order.DESC)
    .addIndex("idxDate", ["date"], false, lf.Order.DESC);

  const db = await schemaBuilder.connect();
  const item = db.getSchema().table("reviews");
  await loadIntoLFDb(db, item, list, header);
  console.timeEnd("insert_csv");
  console.log("db", db);
  console.time("group");
  const group = await db
    .select(lf.fn.count(item.id), item.listing_id)
    .from(item)
    .groupBy(item.done)
    .exec();
  console.time("group");
  console.log("group", group);
}

export default async function boot() {
  console.time("donwload_csv");
  let url =
    "/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv";
  url = "/_data/airbnb/belgium/vlg/ghent/2019-07-15/visualisations/reviews.csv";
  const fileReq = await fetch(url);
  const text = await fileReq.text();
  console.timeEnd("donwload_csv");
  console.time("parse_csv");
  const parsed: any[] = await parseCSV(text);
  console.timeEnd("parse_csv");
  console.log("json.", parsed);
  console.time("insert_csv");
  const header = parsed.slice(0, 1)[0];
  const list = parsed.slice(1, parsed.length);
}
