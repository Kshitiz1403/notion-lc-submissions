const { default: fetch } = require('node-fetch')
const { default: axios } = require('axios')
const { getSubmissionHeaders, getQuestionConfig } = require('./lc-util')

const getAllSubmissions = (offset) => {
    return fetch(`https://leetcode.com/api/submissions/?offset=${offset}&limit=20&lastkey=`, {
        headers: getSubmissionHeaders(),
        "body": null,
        "method": "GET"
    })
        .then(data => data.json())
        .then(data => data.submissions_dump)
        .then(submissions => {
            return submissions.map(({ id, lang, timestamp, status_display, runtime, memory, code, title_slug, title, url }) => {
                title = title.trim();
                const submissionLink = `https://leetcode.com${url}`;
                const problemLink = `https://leetcode.com/problems/${title_slug}/`
                return { submissionId: id, language: lang, date_of_submission: timestamp, status: status_display, runtime, memory, code, submissionLink, problemLink, title_slug, title }
            })
        })
        .then(submissions => submissions.reverse())
}

const getQuestion = async (problemSlug) => {
    var axios = require('axios');
    const { config } = getQuestionConfig(problemSlug);

    return axios(config)
        .then(data => data.data)
        .then(data => data.data.question)
        .then(data => {
            const title = (data['title']).trim();
            const slug = data['titleSlug'];
            const difficulty = data['difficulty'];
            let topicTags = data['topicTags'];
            topicTags = topicTags.map(topic => topic.name)
            topicTags = topicTags.filter(topic => topic != 'Array')

            return { title, slug, difficulty, topicTags }
        })
}

module.exports = { getAllSubmissions, getQuestion }