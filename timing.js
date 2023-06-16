require('dotenv').config()
const { Client } = require("@notionhq/client");
// const companyProblems = require("./tags.json")

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

const DB_ID = '90532ba853374a579696a596b01499c6';

(async () => {
    let response = await notion.databases.query({ database_id: DB_ID })
    let totalUpdates = 0;
    const doOperation = async () => {
        for  (let record of response.results){
            const page_id = record.id
            const metaData = record.properties.Metadata.rich_text[0].plain_text;
            let solve_times =  metaData.split(", ")
            const latest_solve_time = parseInt(solve_times[solve_times.length-1]);

            console.log(record.properties.Solved_on)
            notion.pages.update({
                page_id, properties:{
                    "Most Recent Submission":{
                        type:"number",
                        number:latest_solve_time
                    }
                }
            })
            totalUpdates++;
        }
    }
    await doOperation();

    while (response.has_more) {
        response = await notion.databases.query({ start_cursor: response.next_cursor, database_id: DB_ID })
        
        await doOperation();
    }
    console.log(totalUpdates)
})();