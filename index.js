require("dotenv").config()
const { getAllSubmissions, getQuestion } = require("./lc");
const axios = require("axios").default
const fs = require("fs")
const logger = require("./logger");
const { getLanguageAdaptor } = require("./languageAdaptor");
const { sleep } = require("./sleep");

(async () => {

    let data = (await axios.get('https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/company_info.json')).data;
    fs.writeFileSync("tags.json", JSON.stringify(data))

    const runs = [
        1000, 980, 960, 940, 920, 900, 880, 860,
         840, 820, 800, 780, 760, 740, 720, 700,
         680, 660, 640, 620, 600, 580, 560, 540,
         520, 500, 480, 460, 440, 420, 400, 380,
         360, 340, 320, 300, 280, 260, 240, 220,
         200, 180, 160, 140, 120, 100,  80,  60,
          40,  20
      ]

    let addSubmission = require("./submission");

    for await (let run of runs) {

        logger.info(`Run - ${run}`)

        const submissions = await getAllSubmissions(run);
        const promises = submissions.map(async submission => {
            const slug = submission.title_slug;
            const question = await getQuestion(slug);
            return { ...submission, ...question };
        })
        const results = await Promise.all(promises);

        for await (let result of results) {
            let languageAdaptor = getLanguageAdaptor(result.language);
            
            const nP = await addSubmission({ code: result.code, date_of_submission: result.date_of_submission, difficulty: result.difficulty, language: languageAdaptor, memory: result.memory, problemLink: result.problemLink, problemName: result.title, runtime: result.runtime, status: result.status, submissionId: result.submissionId, submissionLink: result.submissionLink, topics: result.topicTags });
        }
        await sleep(2000)
    }

})();