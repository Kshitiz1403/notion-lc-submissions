require('dotenv').config()
const { Client } = require("@notionhq/client");
const companyProblems = require("./leetcode_company_tagged_problems.json")
const logger = require("./logger");

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

const DB_ID = process.env.DB_ID;

const addBlock = ({ text, type, code, language }) => {
    if (type == 'code') {
        let len = code.length;
        let currentIndex = 0;
        let rich_texts = []
        while (len - currentIndex > 0) {
            let nextIndex = (currentIndex + 1999);
            let substring = code.substring(currentIndex, nextIndex);
            currentIndex = nextIndex;

            let rich_text_object = {
                type: "text",
                text: {
                    content: substring
                }
            }
            rich_texts.push(rich_text_object)
        }
        const block = {
            code: {
                rich_text: rich_texts,
                language
            }
        }
        return block
    }

    const block = {
        paragraph: {
            rich_text: [
                {
                    type: "text",
                    text: { content: text }
                }
            ]
        }
    }
    return block
}

const addSubmission = async ({ submissionId, problemName, problemLink, difficulty, topics, code, runtime, memory, status, date_of_submission, language, submissionLink }) => {

    logger.info(`Problem - ${problemName}`)
    logger.info(`Submission - ${submissionId}`)

    const query = await notion.databases.query({ database_id: DB_ID, filter: { property: 'Problem', rich_text: { equals: problemName } } });

    let page_id;
    let previousMetadata = "";

    const slug = problemLink.split("/problems")[1]
    let companies = [];
    if (companyProblems && companyProblems[slug]) {
        companies = companyProblems[slug];
        companies = companies.map(company => company.company);
    }

    if (query.results.length == 0) {

        const createdPage = await notion.pages.create({
            properties: {
                Difficulty: {
                    type: "select",
                    select: {
                        name: difficulty
                    }
                },
                Problem: {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: problemName,
                                link: {
                                    url: problemLink
                                }
                            },
                            plain_text: problemName,
                            href: problemLink
                        }
                    ]
                },
                Topics: {
                    type: 'multi_select',
                    multi_select: topics.map(topic => {
                        return { name: topic }
                    })
                },
                Company: {
                    type: "multi_select",
                    multi_select: companies.map(company => {
                        return { name: company }
                    })
                }
            },
            parent: { type: 'database_id', database_id: DB_ID }
        })
        page_id = createdPage.id

    } else {
        page_id = query.results[0].id;
        previousMetadata = query.results[0].properties.Metadata.rich_text[0].text.content;
    }

    const children = await notion.blocks.children.list({ block_id: page_id });
    for (let child of children.results) {
        const child_page_title = parseInt(child.child_page.title.split(' ')[0]);
        if (child_page_title == submissionId) {
            logger.debug("duplicate, exiting...")
            logger.debug("--------")
            return;
        }
    }

    const subPageTitle = `${submissionId} ${new Date(date_of_submission * 1000).toLocaleString(undefined, {timeZone:'Asia/Kolkata'})} ${status}`

    const blockPage = await notion.pages.create({
        parent: {
            type: 'page_id', page_id
        },
        properties: {
            title: [{
                type: 'text', text: {
                    content: subPageTitle, link: {
                        url: submissionLink
                    }
                }, plain_text: subPageTitle, href: submissionLink
            }]
        }
    });

    const appendChildren = [];
    appendChildren.push(addBlock({ type: "code", language, code }))
    appendChildren.push(addBlock({ type: "text", text: `Status - ${status}` }));
    appendChildren.push(addBlock({ type: "text", text: `Runtime - ${runtime}` }));
    appendChildren.push(addBlock({ type: 'text', text: `Memory - ${memory}` }))

    await notion.blocks.children.append({ block_id: blockPage.id, children: appendChildren })

    if (previousMetadata) {
        previousMetadata = previousMetadata.split(", ").map(num => parseInt(num))
    } else {
        previousMetadata = []
    }

    let currentMetaData = [...previousMetadata];
    currentMetaData.push(date_of_submission * 1000);

    currentMetaData.sort((a, b) => b - a);

    let solvedOn = currentMetaData.map(num => new Date(num).toDateString());

    solvedOn = solvedOn.join(", ");
    currentMetaData = currentMetaData.join(", ");


    const pageUpdate = await notion.pages.update({
        page_id: page_id, properties: {
            Metadata: {
                rich_text: [
                    {
                        type: "text",
                        text: { content: currentMetaData }
                    }
                ]
            },
            "Solved on": {
                rich_text: [
                    {
                        type: "text",
                        text: { content: solvedOn }
                    }
                ]
            }

        }
    })
    logger.silly("--------")
}


// python3 -> python

module.exports = addSubmission