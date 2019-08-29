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
export async function loadIntoDB(list: any[], headers: any[]): Promise<any[]> {
  var schemaBuilder = lf.schema.create("items", 1);

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
  const rows = list.map(el => {
    return item.createRow({
      id: el[0] + el[1],
      listing_id: el[0],
      date: el[1]
    });
  });
  await db
    .insertOrReplace()
    .into(item)
    .values(rows)
    .exec();
  const res = await db
    .select(item.id)
    .from(item)
    .exec();
  return res;
}

export default async function boot() {
  console.time("donwload_csv");
  const url =
    "/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv";
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
  const res = await loadIntoDB(list, header);
  console.timeEnd("insert_csv");
  console.log("res", res);
}
