require("dotenv").config();
const { Client } = require("@notionhq/client");
const companyProblems = require("./tags.json");
const { getBasicAllSubmissions } = require("./lc");
const { getLanguageAdaptor } = require("./languageAdaptor");
const fs = require("fs");
const { sleep } = require("./sleep");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DB_ID = "90532ba853374a579696a596b01499c6";

let totalUpdated = 0;

/**
 * get all submissions
    let pUrl = `https://leetcode.com/problems${slug}`;
 * 
 */


(async () => {
  let offset = fs.existsSync("./lastExecution.txt")? parseInt(fs.readFileSync("./lastExecution.txt")) : 0;
  while (true) {
    fs.writeFileSync("./lastExecution.txt", offset.toString());
    const submissions = await getBasicAllSubmissions(offset);
    if (submissions.length == 0) break;
    for await (let sub of submissions) {
      const slug = sub.title_slug;
      const pUrl = `https://leetcode.com/problems/${slug}`;
      const title = sub.title;
      const lang = sub.lang;
      console.log("Title- ", title);

      const query = await notion.databases.query({
        database_id: DB_ID,
        filter: {
          property: "Problem",
          rich_text: {
            equals: title,
          },
        },
      });
      const page_id = query.results[0].id;
      const multi_select = query.results[0].properties[
        "Languages"
      ].multi_select.map((r) => r.name);
      multi_select.push(lang);

      const a = multi_select.map((r) => {
        return { name: getLanguageAdaptor(r) };
      });

      await notion.pages.update({
        page_id,
        properties: {
          Languages: {
            type: "multi_select",
            multi_select: a,
          },
        },
      });
    }
    await sleep(2000);
    offset += 20;
    console.log("Offset- ", offset);
  }
})();
