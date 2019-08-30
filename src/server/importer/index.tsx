import parse from "csv-parse";
import fetch from "node-fetch";
import series from "async/series";
import crypto from "crypto";
export function parseCSV(text: string) {
  return new Promise(function(resolve, reject) {
    const output: any[] = [];
    parse(text, {
      trim: true,
      skip_empty_lines: true
    })
      // Use the readable stream api
      .on("readable", function(this: any) {
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

export async function parseURLAsCSV(
  url: string
): Promise<{ header: string[]; list: any[] }> {
  const fileReq = await fetch(url);
  const text = await fileReq.text();
  console.timeEnd("donwload_csv_" + url);
  console.time("parse_csv_" + url);
  const parsed: any = await parseCSV(text);
  console.timeEnd("parse_csv_" + url);
  console.time("insert_csv_" + url);
  const header = parsed.slice(0, 1)[0];
  const list = parsed.slice(1, parsed.length);
  return {
    header,
    list
  };
}

export async function doTransformWork(
  reviewsList: any[],
  listingsList: any[],
  cityName: string
): Promise<any[]> {
  const t = new Date("12/12/1918");
  console.log("doTransformWork");
  const f = (item: any[]) => {
    const d = new Date(item[1]);
    return d.getTime() > t.getTime();
  };
  const filtered = reviewsList.filter(f);
  console.log("filtered", filtered.length);
  const list = filtered.map(review => {
    const listing = listingsList.find(listing => listing[0] === review[0]);
    const obj = {
      id: review[0] + "/" + review[1],
      date: new Date(review[1]),
      listing_id: review[0],
      //type: "item",
      ...(listing
        ? {
            city: cityName,
            neighbourhood: listing[5],
            room_type: listing[8],
            price: parseInt(listing[9])
          }
        : {
            city: null,
            neighbourhood: null,
            room_type: null,
            price: null
          })
    };

    var hash = crypto
      .createHash("md5")
      .update(JSON.stringify(obj))
      .digest("hex");
    (obj as any).checksum = hash;
    return obj;
  });
  console.log("liist", list.length);
  // remove duplicates
  return list.map(el => el.id).map(id => list.find(el => el.id === id));
}

export function getCites() {
  return [
    //    {
    //      name: "ghent",
    //      urls: [
    //        "http://localhost:5000/_data/airbnb/belgium/vlg/ghent/2019-07-15/visualisations/reviews.csv",
    //        "http://localhost:5000/_data/airbnb/belgium/vlg/ghent/2019-07-15/visualisations/listings.csv"
    //      ]
    //    },
    //    {
    //      name: "antwerp",
    //      urls: [
    //        "http://localhost:5000/_data/airbnb/belgium/vlg/antwerp/2019-06-25/visualisations/reviews.csv",
    //        "http://localhost:5000/_data/airbnb/belgium/vlg/antwerp/2019-06-25/visualisations/listings.csv"
    //      ]
    //    },
    //    {
    //      name: "ghent",
    //      urls: [
    //        "http://localhost:5000/_data/airbnb/belgium/vlg/ghent/2019-07-15/visualisations/reviews.csv",
    //        "http://localhost:5000/_data/airbnb/belgium/bru/brussels/2019-07-13/visualisations/listings.csv"
    //      ]
    //    },
    {
      name: "milano",
      urls: [
        "http://localhost:5000/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv",
        "http://localhost:5000/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/listings.csv"
      ]
    }
  ];
}
export async function doLoadWork(urls: string[]) {
  const [reviewsData, listingsData] = await Promise.all(
    urls.map(parseURLAsCSV)
  );
  console.log(reviewsData.list.length, listingsData.list.length);
  return [reviewsData, listingsData];
}
export function chunk(arr: any[], len: any) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

export async function doSingleCityWork(
  client: any,
  city: any,
  doPublishWork: Function
) {
  const { urls, name } = city;
  console.log("processing", name);
  console.time("donwload_csvs");
  const [reviewsData, listingsData] = await doLoadWork(urls);

  const chunks = chunk(reviewsData.list, 10000);
  console.log(chunk([1, 2, 3, 4, 5, 6, 7, 7, 8], 2));
  console.timeEnd("donwload_csvs");
  console.log(reviewsData.list.length, listingsData.list.length);
  //updateDB(list, header);
  const smallWorker = async (chunk: any) => {
    console.time("transform");
    const transformed = await doTransformWork(chunk, listingsData.list, name);
    console.timeEnd("transform");
    console.log("transformed", transformed.length);
    try {
      await doPublishWork(client, transformed, "list");
    } catch (e) {
      console.log("e", e);
      throw e;
    }
  };
  const tasks = chunks.map(chunk => {
    return function worker(callback: any) {
      smallWorker(chunk)
        .then(res => callback(null, res))
        .catch(err => callback(err));
    };
  });
  const results = await series(tasks);
  return results;
}
export default async function boot(client: any, doPublishWork: Function) {
  const cities = getCites();
  const tasks = cities.map((city: any) => {
    return async function(callback: Function) {
      doSingleCityWork(client, city, doPublishWork)
        .then(function(resp) {
          callback(null, resp);
        })
        .catch(err => callback(err));
    };
  });
  const results = await series(tasks);
  console.log("results", results);
}
