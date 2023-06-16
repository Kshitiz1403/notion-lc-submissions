require('dotenv').config()
const { Client } = require("@notionhq/client");
const companyProblems = require("./tags.json")

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

const DB_ID = '90532ba853374a579696a596b01499c6';

let totalUpdated = 0;

(async () => {
    let response = await notion.databases.query({ database_id: DB_ID })

    // console.log(JSON.stringify(response, null, 4))
    // console.log(response.results.length)
    let count = response.results.length;

    const doOperation = async () => {
        for await (let record of response.results) {
            const page_id = record.id
            const url = record.properties.Problem.title[0].text.link.url;
            const slug = url.split("/problems")[1]
            let pUrl = `https://leetcode.com/problems${slug}`;
            let companies = companyProblems[pUrl];
            if (companyProblems && companyProblems[pUrl]) {
                companies = companyProblems[pUrl].slice(1);
                // console.log(companies)
                // companies = companies.map(company => company.company);
            }
            if (companies && companies.length > 0) {
                await notion.pages.update({
                    page_id, properties: {
                        "Company": {
                            type: "multi_select",
                            multi_select: companies.map(company => {
                                return { name: company }
                            })
                        }
                    }
                })
                totalUpdated++;
            }
        }
    }

    await doOperation();

    while (response.has_more) {
        response = await notion.databases.query({ start_cursor: response.next_cursor, database_id: DB_ID })
        
        await doOperation();
    }
    console.log("Total Updated -", totalUpdated)
})();

