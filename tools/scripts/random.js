const fs = require("fs");
const json = JSON.parse(
  fs.readFileSync(__dirname + "/../../src/css_editor/src/grammar/crawl.json"),
  "utf8"
);
fs.writeFileSync(
  __dirname + "/../../src/css_editor/src/grammar/crawl2.json",
  JSON.stringify({
    ...json,
    results: json.results.filter(
      el => el.css && Object.keys(el.css.properties).length > 0
    )
  })
);
