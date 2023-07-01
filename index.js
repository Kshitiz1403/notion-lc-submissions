const { getAllSubmissions, getQuestion } = require("./lc");
const axios = require("axios").default
const fs = require("fs")
let addSubmission;
const logger = require("./logger");

(async () => {
    
    let data = (await axios.get('https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/company_info.json')).data;
    fs.writeFileSync("tags.json", JSON.stringify(data))

    const runs = [
        0
    ]
    
    addSubmission = require("./submission")

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
            let languageAdaptor;
            switch (result.language) {
                case "python3":
                    languageAdaptor = "python";
                    break;
                case "cpp":
                    languageAdaptor = "c++";
                    break;
                case "mysql":
                    languageAdaptor = "sql";
                    break
                case "golang":
                    languageAdaptor = "go"
                    break
                default:
                    languageAdaptor = result.language;
            }

            const nP = await addSubmission({ code: result.code, date_of_submission: result.date_of_submission, difficulty: result.difficulty, language: languageAdaptor, memory: result.memory, problemLink: result.problemLink, problemName: result.title, runtime: result.runtime, status: result.status, submissionId: result.submissionId, submissionLink: result.submissionLink, topics: result.topicTags });
        }
    }

})();