import parse from "csv-parse";

export function parseCSV(text: string) {
  return new Promise(function(resolve, reject) {
    const output = [];
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

export default async function boot() {
  console.time("donwload_csv");
  const url =
    "/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv";
  const fileReq = await fetch(url);
  const text = await fileReq.text();
  console.timeEnd("donwload_csv");
  console.time("parse_csv");
  const parsed = await parseCSV(text);
  console.timeEnd("parse_csv");
  console.log("json.", parsed);
}
