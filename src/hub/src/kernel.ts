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
  const url =
    "/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv";
  const fileReq = await fetch("https://api.allorigins.win/get?url=" + url);
  const text = await fileReq.text();
  const parsed = await parseCSV(text);
  console.log("json.", parsed);
}
